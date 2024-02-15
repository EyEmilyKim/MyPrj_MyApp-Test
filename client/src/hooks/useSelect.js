import { useState } from 'react';
import useStateLogger from './useStateLogger';

export default function useSelect(initialIndex) {
  const [selectedIndex, setSelectedIndex] = useState(initialIndex);
  // useStateLogger(selectedIndex, 'selectedIndex');
  const [selectedValue, setSelectedValue] = useState('');
  const [selectedText, setSelectedText] = useState('');

  const handleSelectChange = (e) => {
    const selectedIndex = e.target.selectedIndex;
    const selectedOption = e.target.options[selectedIndex];

    setSelectedIndex(selectedIndex);
    setSelectedValue(selectedOption.value);
    setSelectedText(selectedOption.text);
  };

  return [handleSelectChange, selectedValue, setSelectedValue, selectedText, selectedIndex];
}
