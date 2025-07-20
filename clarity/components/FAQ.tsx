import React, { useState } from 'react';
import ChevronDownIcon from './icons/ChevronDownIcon';

interface FAQItem {
  question: string;
  answer: string;
}

interface FAQProps {
  items: FAQItem[];
}

const FAQ: React.FC<FAQProps> = ({ items }) => {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const toggleItem = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <div className="w-full max-w-3xl mx-auto space-y-2">
      {items.map((item, index) => (
        <div key={index} className="border-b border-light-outline-variant dark:border-dark-outline-variant last:border-b-0">
          <button
            onClick={() => toggleItem(index)}
            className="w-full flex justify-between items-center text-start py-4"
            aria-expanded={openIndex === index}
          >
            <h3 className="text-title-lg font-medium text-light-on-surface dark:text-dark-on-surface">
              {item.question}
            </h3>
            <ChevronDownIcon 
              className={`h-6 w-6 text-light-on-surface-variant dark:text-dark-on-surface-variant transform transition-transform duration-300 ${openIndex === index ? 'rotate-180' : ''}`}
            />
          </button>
          <div
            className={`overflow-hidden transition-all duration-300 ease-in-out grid ${openIndex === index ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]'}`}
          >
             <div className="min-h-0">
                <p className="text-body-lg text-light-on-surface-variant dark:text-dark-on-surface-variant pb-4 text-start">
                  {item.answer}
                </p>
             </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default FAQ;