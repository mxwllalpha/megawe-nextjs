'use client'

import { motion } from 'framer-motion'
import { ArrowRight, Mail, Bell, Search } from 'lucide-react'
import { useState } from 'react'

/**
 * CallToAction Component
 *
 * CTA section for user engagement and lead generation.
 */

export function CallToAction() {
  const [email, setEmail] = useState('')
  const [isSubscribed, setIsSubscribed] = useState(false)

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault()
    if (email.trim()) {
      // TODO: Implement newsletter subscription
      setIsSubscribed(true)
      setTimeout(() => setIsSubscribed(false), 3000)
      setEmail('')
    }
  }

  return (
    <section className="py-20 bg-gradient-to-r from-primary to-primary/90 text-white relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-[url('/images/cta-pattern.svg')] opacity-10" />

      <div className="container-custom relative">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center max-w-4xl mx-auto"
        >
          <h2 className="text-3xl lg:text-4xl xl:text-5xl font-bold mb-6">
            Ready to Find Your Dream Job?
          </h2>

          <p className="text-xl lg:text-2xl mb-8 text-white/90 max-w-2xl mx-auto">
            Join thousands of professionals who found their perfect career match through Megawe.
            Start your journey today!
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
            <a
              href="/search"
              className="btn bg-white text-primary hover:bg-gray-100 btn-lg inline-flex items-center gap-2"
            >
              <Search className="w-5 h-5" />
              Start Searching
              <ArrowRight className="w-5 h-5" />
            </a>
            <a
              href="/companies"
              className="btn border-2 border-white text-white hover:bg-white hover:text-primary btn-lg inline-flex items-center gap-2"
            >
              Browse Companies
              <ArrowRight className="w-5 h-5" />
            </a>
          </div>

          {/* Newsletter Subscription */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 max-w-md mx-auto"
          >
            <div className="flex items-center justify-center mb-4">
              <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
                <Mail className="w-6 h-6" />
              </div>
            </div>

            <h3 className="text-xl font-semibold mb-2">
              Get Job Alerts
            </h3>

            <p className="text-white/80 text-sm mb-6">
              Receive the latest job opportunities matching your preferences directly in your inbox.
            </p>

            {!isSubscribed ? (
              <form onSubmit={handleSubscribe} className="space-y-4">
                <input
                  type="email"
                  placeholder="Enter your email address"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-4 py-3 bg-white/20 backdrop-blur-sm border border-white/30 rounded-lg text-white placeholder-white/70 focus:outline-none focus:border-white/50 focus:bg-white/25 transition-all"
                  required
                />
                <button
                  type="submit"
                  className="w-full btn bg-white text-primary hover:bg-gray-100 btn-md inline-flex items-center justify-center gap-2"
                >
                  <Bell className="w-4 h-4" />
                  Subscribe to Alerts
                </button>
              </form>
            ) : (
              <div className="text-center py-4">
                <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-3">
                  <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <p className="text-white font-medium">
                  Successfully subscribed!
                </p>
                <p className="text-white/80 text-sm">
                  Check your email for confirmation.
                </p>
              </div>
            )}
          </motion.div>

          {/* Trust Indicators */}
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3 }}
            className="mt-12 pt-8 border-t border-white/20"
          >
            <div className="flex flex-col sm:flex-row items-center justify-center gap-8 text-white/80 text-sm">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-green-400 rounded-full" />
                <span>No spam, ever</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-blue-400 rounded-full" />
                <span>Unsubscribe anytime</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-purple-400 rounded-full" />
                <span>Personalized job matches</span>
              </div>
            </div>
          </motion.div>
        </motion.div>
      </div>

      {/* Decorative Elements */}
      <div className="absolute top-10 right-10 w-20 h-20 bg-white/10 rounded-full blur-xl" />
      <div className="absolute bottom-10 left-10 w-32 h-32 bg-white/5 rounded-full blur-xl" />
    </section>
  )
}