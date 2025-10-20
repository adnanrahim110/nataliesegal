"use client";

import Button from "@/components/ui/Button";
import SectionSubtitle from "@/components/ui/SectionSubtitle";
import SectionTitle from "@/components/ui/SectionTitle";
import { motion } from "motion/react";
import { useState } from "react";
import {
  FaEnvelope,
  FaInstagram,
  FaLinkedin,
  FaMapMarkerAlt,
  FaPaperPlane,
  FaTwitter,
} from "react-icons/fa";

export default function ContactContent() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (
      !formData.name.trim() ||
      !formData.email.trim() ||
      !formData.message.trim()
    )
      return;

    setSubmitting(true);

    setTimeout(() => {
      setSubmitted(true);
      setSubmitting(false);
      setFormData({ name: "", email: "", subject: "", message: "" });
    }, 1000);
  };

  const contactInfo = [
    {
      icon: FaEnvelope,
      label: "Email",
      value: "segalnataliedee@gmail.com",
      href: "mailto:segalnataliedee@gmail.com",
    },

    {
      icon: FaMapMarkerAlt,
      label: "Location",
      value: "Hartford, Connecticut",
      href: null,
    },
  ];

  const socialLinks = [
    { icon: FaTwitter, href: "https://twitter.com", label: "Twitter" },
    { icon: FaInstagram, href: "https://instagram.com", label: "Instagram" },
    { icon: FaLinkedin, href: "https://linkedin.com", label: "LinkedIn" },
  ];

  return (
    <motion.section
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true, margin: "-10% 0px -10% 0px" }}
      transition={{ duration: 0.8, ease: [0.25, 0.25, 0, 1] }}
      className="relative overflow-hidden bg-gradient-to-br from-slate-50 via-white to-primary-50/30"
    >
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_120%,rgba(120,119,198,0.15),transparent_50%)]" />
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-primary-200/40 to-transparent" />

      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/3 -right-40 w-80 h-80 bg-gradient-to-br from-primary-200/30 to-amber-200/20 rounded-full blur-3xl animate-pulse" />
        <div
          className="absolute bottom-1/3 -left-40 w-96 h-96 bg-gradient-to-tr from-purple-200/20 to-primary-100/30 rounded-full blur-3xl animate-pulse"
          style={{ animationDelay: "1s" }}
        />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-gradient-to-r from-primary-100/10 to-amber-100/10 rounded-full blur-2xl" />
      </div>

      <div className="relative container py-20 md:py-32">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, ease: [0.25, 0.25, 0, 1] }}
          className="space-y-6 text-center mb-20"
        >
          <SectionSubtitle align="center">Get In Touch</SectionSubtitle>
          <SectionTitle
            as="h1"
            size="hero"
            align="center"
            fullWidth
            underlineWidth="w-24 md:w-32"
            accentClassName="bg-gradient-to-r from-primary-600 via-primary-500 to-amber-500"
          >
            Contact
          </SectionTitle>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="mt-6 text-xl text-neutral-600 max-w-3xl mx-auto leading-relaxed font-light"
          >
            I'd love to hear from you. Whether you have questions about my work,
            want to discuss a potential collaboration, or simply want to
            connect, feel free to reach out.
          </motion.p>
        </motion.div>

        <div className="grid gap-16 lg:grid-cols-5 max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-10% 0px -10% 0px" }}
            transition={{ duration: 0.8, ease: [0.25, 0.25, 0, 1] }}
            className="order-2 lg:order-1 lg:col-span-3"
          >
            <div className="relative group/form">
              <div className="absolute -inset-px bg-gradient-to-br from-primary-400/30 via-purple-400/20 to-amber-400/30 rounded-3xl transition-all duration-500 opacity-60" />
              <div className="relative rounded-3xl bg-white/95 p-10 ring-1 ring-white/20 backdrop-blur-xl border border-white/30">
                <div className="absolute top-0 right-0 w-40 h-40 bg-gradient-to-br from-primary-200/30 to-transparent rounded-full blur-3xl -translate-y-20 translate-x-20" />
                <div className="absolute bottom-0 left-0 w-32 h-32 bg-gradient-to-tr from-amber-200/20 to-transparent rounded-full blur-2xl translate-y-16 -translate-x-16" />

                <div className="relative z-10">
                  {submitted ? (
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="text-center py-8"
                    >
                      <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-green-100 text-green-600 mb-4">
                        <FaPaperPlane size={24} />
                      </div>
                      <h4 className="font-noticia text-xl text-neutral-900 mb-2">
                        Message Sent!
                      </h4>
                      <p className="text-neutral-600">
                        Thank you for reaching out. I'll get back to you soon.
                      </p>
                      <Button
                        onClick={() => setSubmitted(false)}
                        tone="light"
                        className="mt-4 px-6 py-2"
                        contentClassName="font-serif"
                      >
                        Send Another Message
                      </Button>
                    </motion.div>
                  ) : (
                    <form onSubmit={handleSubmit} className="space-y-6">
                      <div className="grid gap-6 md:grid-cols-2">
                        <motion.div
                          initial={{ opacity: 0, y: 20 }}
                          whileInView={{ opacity: 1, y: 0 }}
                          viewport={{ once: true }}
                          transition={{ duration: 0.5, delay: 0.1 }}
                        >
                          <label
                            htmlFor="name"
                            className="block text-sm font-bold text-neutral-800 mb-3 tracking-wide"
                          >
                            Full Name *
                          </label>
                          <input
                            type="text"
                            id="name"
                            name="name"
                            value={formData.name}
                            onChange={handleInputChange}
                            required
                            className="w-full rounded-2xl border-0 bg-gradient-to-br from-white/90 to-primary-50/20 px-5 py-4 text-base shadow-lg ring-1 ring-primary-200/30 outline-none transition-all duration-300 focus:ring-2 focus:ring-primary-400/50 focus:shadow-xl focus:from-white focus:to-primary-50/30 placeholder:text-neutral-400"
                            placeholder="Your full name"
                          />
                        </motion.div>
                        <motion.div
                          initial={{ opacity: 0, y: 20 }}
                          whileInView={{ opacity: 1, y: 0 }}
                          viewport={{ once: true }}
                          transition={{ duration: 0.5, delay: 0.2 }}
                        >
                          <label
                            htmlFor="email"
                            className="block text-sm font-bold text-neutral-800 mb-3 tracking-wide"
                          >
                            Email Address *
                          </label>
                          <input
                            type="email"
                            id="email"
                            name="email"
                            value={formData.email}
                            onChange={handleInputChange}
                            required
                            className="w-full rounded-2xl border-0 bg-gradient-to-br from-white/90 to-primary-50/20 px-5 py-4 text-base shadow-lg ring-1 ring-primary-200/30 outline-none transition-all duration-300 focus:ring-2 focus:ring-primary-400/50 focus:shadow-xl focus:from-white focus:to-primary-50/30 placeholder:text-neutral-400"
                            placeholder="your@email.com"
                          />
                        </motion.div>
                      </div>

                      <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.5, delay: 0.3 }}
                      >
                        <label
                          htmlFor="subject"
                          className="block text-sm font-bold text-neutral-800 mb-3 tracking-wide"
                        >
                          Subject
                        </label>
                        <input
                          type="text"
                          id="subject"
                          name="subject"
                          value={formData.subject}
                          onChange={handleInputChange}
                          className="w-full rounded-2xl border-0 bg-gradient-to-br from-white/90 to-primary-50/20 px-5 py-4 text-base shadow-lg ring-1 ring-primary-200/30 outline-none transition-all duration-300 focus:ring-2 focus:ring-primary-400/50 focus:shadow-xl focus:from-white focus:to-primary-50/30 placeholder:text-neutral-400"
                          placeholder="What's this about?"
                        />
                      </motion.div>

                      <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.5, delay: 0.4 }}
                      >
                        <label
                          htmlFor="message"
                          className="block text-sm font-bold text-neutral-800 mb-3 tracking-wide"
                        >
                          Your Message *
                        </label>
                        <textarea
                          id="message"
                          name="message"
                          value={formData.message}
                          onChange={handleInputChange}
                          required
                          rows={6}
                          className="w-full rounded-2xl border-0 bg-gradient-to-br from-white/90 to-primary-50/20 px-5 py-4 text-base shadow-lg ring-1 ring-primary-200/30 outline-none transition-all duration-300 focus:ring-2 focus:ring-primary-400/50 focus:shadow-xl focus:from-white focus:to-primary-50/30 resize-none placeholder:text-neutral-400"
                          placeholder="Tell me what's on your mind..."
                        />
                      </motion.div>

                      <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.5, delay: 0.5 }}
                        className="flex justify-end pt-6"
                      >
                        <Button
                          type="submit"
                          disabled={
                            submitting ||
                            !formData.name.trim() ||
                            !formData.email.trim() ||
                            !formData.message.trim()
                          }
                          tone="dark"
                          className="px-10 py-4 relative overflow-hidden group shadow-xl hover:shadow-2xl transition-all duration-300"
                          contentClassName="font-serif flex items-center gap-3 text-base font-semibold tracking-wide"
                        >
                          <FaPaperPlane className="group-hover:rotate-12 transition-transform duration-300" />
                          {submitting ? "Sending..." : "Send Message"}
                        </Button>
                      </motion.div>
                    </form>
                  )}
                </div>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-10% 0px -10% 0px" }}
            transition={{ duration: 0.8, ease: [0.25, 0.25, 0, 1], delay: 0.2 }}
            className="order-1 lg:order-2 lg:col-span-2 space-y-10"
          >
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="text-center lg:text-left"
            >
              <h3 className="font-noticia text-3xl text-neutral-900 mb-4 bg-gradient-to-r from-neutral-900 to-neutral-700 bg-clip-text">
                Let's Connect
              </h3>
              <p className="text-lg text-neutral-600 leading-relaxed font-light">
                Words start conversations and conversations spark ideas. Write
                to Natalie and let something meaningful begin.
              </p>
            </motion.div>

            <div className="space-y-6">
              {contactInfo.map((item, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{
                    duration: 0.6,
                    ease: [0.25, 0.25, 0, 1],
                    delay: 0.4 + index * 0.1,
                  }}
                  className="group"
                >
                  {item.href ? (
                    <a
                      href={item.href}
                      className="group relative flex items-center gap-5 p-6 rounded-2xl bg-gradient-to-br from-white/90 to-primary-50/30 border border-white/50 shadow-lg ring-1 ring-primary-200/20 backdrop-blur-sm hover:from-white hover:to-primary-50/50 hover:shadow-xl hover:scale-[1.02] transition-all duration-500"
                    >
                      <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-primary-100/20 to-transparent opacity-0 group-hover:opacity-50 transition-opacity duration-500" />
                      <div className="relative flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-primary-200/50 to-primary-100/30 ring-1 ring-primary-300/30 group-hover:from-primary-300/60 group-hover:to-primary-200/50 group-hover:scale-110 transition-all duration-500">
                        <item.icon className="text-primary-700 text-xl" />
                      </div>
                      <div className="relative">
                        <div className="text-sm font-bold text-neutral-500 uppercase tracking-wider mb-1">
                          {item.label}
                        </div>
                        <div className="font-bold text-lg text-neutral-900 group-hover:text-primary-800 transition-colors duration-300">
                          {item.value}
                        </div>
                      </div>
                    </a>
                  ) : (
                    <div className="relative flex items-center gap-5 p-6 rounded-2xl bg-gradient-to-br from-white/90 to-primary-50/30 border border-white/50 shadow-lg ring-1 ring-primary-200/20 backdrop-blur-sm">
                      <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-primary-200/50 to-primary-100/30 ring-1 ring-primary-300/30">
                        <item.icon className="text-primary-700 text-xl" />
                      </div>
                      <div>
                        <div className="text-sm font-bold text-neutral-500 uppercase tracking-wider mb-1">
                          {item.label}
                        </div>
                        <div className="font-bold text-lg text-neutral-900">
                          {item.value}
                        </div>
                      </div>
                    </div>
                  )}
                </motion.div>
              ))}
            </div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.8 }}
              className="pt-8"
            >
              <h4 className="font-noticia text-2xl text-neutral-900 mb-6 bg-gradient-to-r from-neutral-900 to-neutral-700 bg-clip-text">
                Follow My Journey
              </h4>
              <div className="flex items-center gap-4">
                {socialLinks.map((social, index) => (
                  <motion.a
                    key={index}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    initial={{ opacity: 0, scale: 0.8 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{
                      duration: 0.5,
                      ease: [0.25, 0.25, 0, 1],
                      delay: 0.9 + index * 0.1,
                    }}
                    whileHover={{ scale: 1.15, y: -2 }}
                    whileTap={{ scale: 0.95 }}
                    className="group relative flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-primary-200/50 to-primary-100/30 ring-1 ring-primary-300/30 text-primary-700 hover:from-primary-300/60 hover:to-primary-200/50 hover:text-primary-800 transition-all duration-500 shadow-lg hover:shadow-xl overflow-hidden"
                    aria-label={social.label}
                  >
                    <div className="absolute inset-0 bg-gradient-to-br from-primary-300/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                    <social.icon
                      size={20}
                      className="relative z-10 group-hover:rotate-12 transition-transform duration-300"
                    />
                  </motion.a>
                ))}
              </div>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </motion.section>
  );
}
