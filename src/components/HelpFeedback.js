import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { HelpCircle, MessageSquare, ChevronDown, ChevronUp, ArrowLeft } from 'lucide-react';

const HelpFeedback = () => {
  const navigate = useNavigate();
  const [activeQuestion, setActiveQuestion] = useState(null);

  const faqs = [
    {
      question: "How do I connect with a fitness buddy?",
      answer: "To connect with a fitness buddy, go to the 'Find a Buddy' section, browse through potential matches, and click 'Connect' on their profile. You can also set your preferences to receive buddy suggestions."
    },
    {
      question: "How can I book a session with a trainer?",
      answer: "To book a trainer, navigate to the 'Trainers' section, select a trainer you're interested in, and click on 'Book Session'. You can then choose an available time slot that works for you."
    },
    {
      question: "How do I change my membership plan?",
      answer: "To change your membership plan, go to the 'Membership' section in your profile. You'll see your current plan and available options. Select the plan you want to switch to and follow the prompts."
    },
    // Add more FAQs as needed
  ];

  return (
    <div className="max-w-4xl mx-auto p-4">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Help & Feedback</h1>
        <button onClick={() => navigate('/')} className="text-orange-500 font-medium flex items-center">
          <ArrowLeft size={20} className="mr-1" /> Back to Dashboard
        </button>
      </div>

      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <h2 className="text-xl font-semibold mb-4 flex items-center">
          <HelpCircle className="mr-2" /> Frequently Asked Questions
        </h2>
        <div className="space-y-4">
          {faqs.map((faq, index) => (
            <div key={index} className="border-b border-gray-200 pb-4">
              <button
                className="flex justify-between items-center w-full text-left"
                onClick={() => setActiveQuestion(activeQuestion === index ? null : index)}
              >
                <span className="font-medium">{faq.question}</span>
                {activeQuestion === index ? <ChevronUp /> : <ChevronDown />}
              </button>
              {activeQuestion === index && (
                <p className="mt-2 text-gray-600">{faq.answer}</p>
              )}
            </div>
          ))}
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-semibold mb-4 flex items-center">
          <MessageSquare className="mr-2" /> Send Feedback
        </h2>
        <form>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">Subject</label>
            <input type="text" className="w-full border-gray-300 rounded-md shadow-sm" />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">Message</label>
            <textarea rows="4" className="w-full border-gray-300 rounded-md shadow-sm"></textarea>
          </div>
          <button type="submit" className="bg-orange-500 text-white py-2 px-4 rounded-lg hover:bg-orange-600 transition-colors">
            Submit Feedback
          </button>
        </form>
      </div>
    </div>
  );
};

export default HelpFeedback;