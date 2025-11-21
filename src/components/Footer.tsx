import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Box, Container, Typography, Grid, Paper } from "@mui/material";
import { Facebook, Instagram, Twitter, Youtube } from "lucide-react";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  const socialLinks = [
    { icon: Facebook, label: "Facebook", href: "#" },
    { icon: Instagram, label: "Instagram", href: "#" },
    { icon: Twitter, label: "Twitter", href: "#" },
    { icon: Youtube, label: "YouTube", href: "#" },
  ];

  const footerSections = [
    {
      title: "Quick Links",
      links: [
        { label: "Home", href: "/" },
        { label: "Coaches", href: "/coaches" },
        { label: "How It Works", href: "/how-it-works" },
        { label: "Pricing", href: "/pricing" },
      ],
    },
    {
      title: "Support",
      links: [
        { label: "FAQ", href: "#" },
        { label: "Contact Us", href: "#" },
        { label: "Terms of Service", href: "#" },
        { label: "Privacy Policy", href: "#" },
      ],
    },
    {
      title: "Resources",
      links: [
        { label: "Blog", href: "/blog" },
        { label: "Community", href: "#" },
        { label: "Documentation", href: "#" },
        { label: "API Docs", href: "#" },
      ],
    },
  ];

  return (
    <Box
      component="footer"
      sx={{
        background: "linear-gradient(135deg, #1a365d 0%, #0d1b2a 50%, #1a365d 100%)",
        color: "white",
        position: "relative",
        overflow: "hidden",
      }}
    >
      <Container maxWidth="lg" sx={{ py: { xs: 10, md: 14 } }}>
        <Grid container spacing={{ xs: 6, md: 8 }}>
          {/* Brand Section */}
          <Grid item xs={12} md={3}>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <Link to="/" style={{ textDecoration: "none", display: "flex", alignItems: "center", marginBottom: "16px" }}>
                <Box
                  sx={{
                    width: 40,
                    height: 40,
                    borderRadius: "50%",
                    background: "linear-gradient(135deg, #ff7e00 0%, #ff9500 100%)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    marginRight: "12px",
                  }}
                >
                  <Typography sx={{ color: "white", fontWeight: 800 }}>S</Typography>
                </Box>
                <Typography
                  sx={{
                    fontSize: "20px",
                    fontWeight: 800,
                    color: "white",
                    fontFamily: '"Poppins", "Sora", sans-serif',
                  }}
                >
                  Servelytica
                </Typography>
              </Link>

              <Typography
                sx={{
                  fontSize: "14px",
                  color: "rgba(255, 255, 255, 0.7)",
                  mb: 3,
                  lineHeight: 1.6,
                }}
              >
                Professional sports coaching platform with AI-powered analysis and expert guidance to elevate your game.
              </Typography>

              {/* Social Links */}
              <Box sx={{ display: "flex", gap: 2 }}>
                {socialLinks.map((social, index) => (
                  <motion.a
                    key={index}
                    href={social.href}
                    initial={{ opacity: 0, y: 10 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    whileHover={{ scale: 1.2, rotate: 5 }}
                    transition={{ delay: index * 0.1 }}
                    style={{
                      width: 40,
                      height: 40,
                      borderRadius: "50%",
                      background: "rgba(255, 126, 0, 0.2)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      color: "#ff7e00",
                      border: "1px solid rgba(255, 126, 0, 0.3)",
                      textDecoration: "none",
                    }}
                  >
                    <social.icon size={18} />
                  </motion.a>
                ))}
              </Box>
            </motion.div>
          </Grid>

          {/* Footer Sections */}
          {footerSections.map((section, sectionIndex) => (
            <Grid item xs={12} sm={6} md={3} key={sectionIndex}>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: (sectionIndex + 1) * 0.1 }}
              >
                <Typography
                  sx={{
                    fontSize: "16px",
                    fontWeight: 700,
                    mb: 3,
                    color: "#ff7e00",
                    fontFamily: '"Poppins", "Sora", sans-serif',
                  }}
                >
                  {section.title}
                </Typography>

                <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
                  {section.links.map((link, linkIndex) => (
                    <Link
                      key={linkIndex}
                      to={link.href}
                      style={{ textDecoration: "none" }}
                    >
                      <Typography
                        sx={{
                          fontSize: "14px",
                          color: "rgba(255, 255, 255, 0.7)",
                          transition: "all 0.3s ease",
                          cursor: "pointer",
                          "&:hover": {
                            color: "#ff7e00",
                            pl: 1,
                          },
                        }}
                      >
                        {link.label}
                      </Typography>
                    </Link>
                  ))}
                </Box>
              </motion.div>
            </Grid>
          ))}
        </Grid>

        {/* Divider */}
        <Box
          sx={{
            borderTop: "1px solid rgba(255, 126, 0, 0.2)",
            my: 6,
          }}
        />

        {/* Bottom Section */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 3 }}>
            <Typography sx={{ fontSize: "14px", color: "rgba(255, 255, 255, 0.6)" }}>
              © {currentYear} Servelytica. All rights reserved.
            </Typography>

            <Box sx={{ display: "flex", gap: 4, flexWrap: "wrap" }}>
              <Link to="#" style={{ textDecoration: "none" }}>
                <Typography sx={{ fontSize: "14px", color: "rgba(255, 255, 255, 0.6)", "&:hover": { color: "#ff7e00" } }}>
                  Terms
                </Typography>
              </Link>
              <Link to="#" style={{ textDecoration: "none" }}>
                <Typography sx={{ fontSize: "14px", color: "rgba(255, 255, 255, 0.6)", "&:hover": { color: "#ff7e00" } }}>
                  Privacy
                </Typography>
              </Link>
              <Link to="#" style={{ textDecoration: "none" }}>
                <Typography sx={{ fontSize: "14px", color: "rgba(255, 255, 255, 0.6)", "&:hover": { color: "#ff7e00" } }}>
                  Cookies
                </Typography>
              </Link>
            </Box>
          </Box>
        </motion.div>
      </Container>
    </Box>
  );
};

export default Footer;
