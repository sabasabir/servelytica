// Video processing utilities using FFmpeg
import { spawn } from 'child_process';
import path from 'path';
import fs from 'fs';

export interface ProcessingResult {
  success: boolean;
  inputPath: string;
  outputPath: string;
  error?: string;
  duration?: number;
}

/**
 * Check if FFmpeg is available
 */
export function isFfmpegAvailable(): boolean {
  try {
    const { execSync } = require('child_process');
    execSync('ffmpeg -version', { stdio: 'ignore' });
    return true;
  } catch {
    return false;
  }
}

/**
 * Get video duration in seconds
 */
export async function getVideoDuration(filePath: string): Promise<number> {
  return new Promise((resolve, reject) => {
    const ffprobe = spawn('ffprobe', [
      '-v', 'error',
      '-show_entries', 'format=duration',
      '-of', 'default=noprint_wrappers=1:nokey=1:noprint_wrappers=1',
      filePath
    ]);

    let duration = '';
    ffprobe.stdout.on('data', (data) => {
      duration += data.toString();
    });

    ffprobe.on('close', (code) => {
      if (code === 0 && duration) {
        resolve(parseFloat(duration.trim()));
      } else {
        reject(new Error('Failed to get video duration'));
      }
    });

    ffprobe.on('error', reject);
  });
}

/**
 * Normalize video to H.264 codec at 720p
 * This ensures compatibility across all browsers
 */
export async function normalizeVideo(
  inputPath: string,
  outputPath: string
): Promise<ProcessingResult> {
  return new Promise((resolve) => {
    // Ensure output directory exists
    const outputDir = path.dirname(outputPath);
    if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir, { recursive: true });
    }

    const ffmpeg = spawn('ffmpeg', [
      '-i', inputPath,
      '-vf', 'scale=1280:720:force_original_aspect_ratio=decrease,pad=1280:720:(ow-iw)/2:(oh-ih)/2',
      '-c:v', 'libx264',
      '-preset', 'fast',
      '-crf', '23',
      '-c:a', 'aac',
      '-b:a', '128k',
      '-y', // Overwrite output file
      outputPath
    ]);

    let errorOutput = '';
    ffmpeg.stderr.on('data', (data) => {
      errorOutput += data.toString();
    });

    ffmpeg.on('close', async (code) => {
      if (code === 0 && fs.existsSync(outputPath)) {
        try {
          const duration = await getVideoDuration(outputPath);
          resolve({
            success: true,
            inputPath,
            outputPath,
            duration
          });
        } catch (error) {
          resolve({
            success: false,
            inputPath,
            outputPath,
            error: 'Failed to get video duration after processing'
          });
        }
      } else {
        resolve({
          success: false,
          inputPath,
          outputPath,
          error: errorOutput || 'FFmpeg processing failed'
        });
      }
    });

    ffmpeg.on('error', (error) => {
      resolve({
        success: false,
        inputPath,
        outputPath,
        error: error.message
      });
    });
  });
}

/**
 * Extract a clip from a video
 */
export async function extractClip(
  inputPath: string,
  outputPath: string,
  startSeconds: number,
  durationSeconds: number
): Promise<ProcessingResult> {
  return new Promise((resolve) => {
    const outputDir = path.dirname(outputPath);
    if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir, { recursive: true });
    }

    const ffmpeg = spawn('ffmpeg', [
      '-i', inputPath,
      '-ss', startSeconds.toString(),
      '-t', durationSeconds.toString(),
      '-c:v', 'libx264',
      '-c:a', 'aac',
      '-y',
      outputPath
    ]);

    let errorOutput = '';
    ffmpeg.stderr.on('data', (data) => {
      errorOutput += data.toString();
    });

    ffmpeg.on('close', (code) => {
      if (code === 0 && fs.existsSync(outputPath)) {
        resolve({
          success: true,
          inputPath,
          outputPath
        });
      } else {
        resolve({
          success: false,
          inputPath,
          outputPath,
          error: errorOutput || 'Clip extraction failed'
        });
      }
    });

    ffmpeg.on('error', (error) => {
      resolve({
        success: false,
        inputPath,
        outputPath,
        error: error.message
      });
    });
  });
}
