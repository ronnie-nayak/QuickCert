'use client';
import React from 'react';
import { motion } from 'framer-motion';
import { FileCheck, Shield, Users, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

const LandingPage = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-100 to-white">
      <header className="bg-white shadow-md">
        <nav className="mx-auto px-6 py-3 flex justify-between items-center">
          <div className="flex items-center">
            <FileCheck className="h-8 w-8 text-blue-600 mr-2" />
            <span className="text-xl font-bold text-gray-800">QuickCert</span>
          </div>
          <Link href="/login">
            <Button variant="outline">Login</Button>
          </Link>
        </nav>
      </header>

      <main className="mx-auto px-6 py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-4">
            Secure Document Verification
          </h1>
          <p className="text-xl text-gray-600 mb-8">
            Fast, reliable, and tamper-proof verification for all your important
            documents.
          </p>
          <Link href="/login" className="px-8 py-3 w-20">
            <Button size="lg" className="text-lg">
              Get Started <ArrowRight className="ml-2" />
            </Button>
          </Link>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-8 mb-16">
          {[
            {
              icon: Shield,
              title: 'Secure',
              description: 'Advanced encryption to protect your documents'
            },
            {
              icon: Users,
              title: 'Trusted',
              description: 'Used by governments and Fortune 500 companies'
            },
            {
              icon: FileCheck,
              title: 'Efficient',
              description: 'Verify documents in seconds, not days'
            }
          ].map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="bg-white rounded-lg shadow-lg p-6 text-center"
            >
              <feature.icon className="h-12 w-12 text-blue-600 mx-auto mb-4" />
              <h2 className="text-xl font-semibold mb-2">{feature.title}</h2>
              <p className="text-gray-600">{feature.description}</p>
            </motion.div>
          ))}
        </div>

        <section className="mb-16  max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-8">How It Works</h2>
          <div className="flex flex-col md:flex-row justify-between gap-8 items-center ">
            <motion.img
              src="https://t4.ftcdn.net/jpg/01/87/31/25/360_F_187312561_kMY7AYVLSwCz6Jua7KusMMPQtb4TayFA.jpg"
              alt="Document verification process"
              className="rounded-lg shadow-md mb-8 md:mb-0 md:ml-8 w-1/2"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
            />
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              className="md:w-1/2"
            >
              <ol className="list-decimal list-inside space-y-4">
                <li className="text-lg text-gray-700">Upload your document</li>
                <li className="text-lg text-gray-700">
                  Our AI analyzes the document
                </li>
                <li className="text-lg text-gray-700">
                  Receive verification results instantly
                </li>
                <li className="text-lg text-gray-700">
                  Share verified documents securely
                </li>
              </ol>
            </motion.div>
          </div>
        </section>

        <section className="bg-blue-100 rounded-lg p-8 mb-16">
          <h2 className="text-3xl font-bold text-center">
            Trusted by Industry Leaders
          </h2>
        </section>

        <section className="text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to get started?</h2>
          <p className="text-xl text-gray-600 mb-8">
            Join thousands of organizations that trust QuickCert for their
            document verification needs.
          </p>
          <Link href="/register" className="text-lg px-8 py-3">
            <Button size="lg">Sign Up Now</Button>
          </Link>
        </section>
      </main>

      <footer className="bg-gray-100 mt-16">
        <div className="mx-auto px-6 py-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="mb-4 md:mb-0">
              <span className="text-xl font-bold text-gray-800">QuickCert</span>
              <p className="text-gray-600 mt-2">
                © 2024 QuickCert. All rights reserved.
              </p>
            </div>
            <div className="flex space-x-4">
              <a href="#" className="text-gray-600 hover:text-blue-600">
                Privacy Policy
              </a>
              <a href="#" className="text-gray-600 hover:text-blue-600">
                Terms of Service
              </a>
              <a href="#" className="text-gray-600 hover:text-blue-600">
                Contact Us
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
