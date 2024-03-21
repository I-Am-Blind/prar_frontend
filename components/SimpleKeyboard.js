import React, { useEffect, useState } from 'react';
import Keyboard from 'simple-keyboard';
import 'simple-keyboard/build/css/index.css';

const SimpleKeyboard = ({ onKeyPress, inputName }) => {
  const [keyboard, setKeyboard] = useState();

  useEffect(() => {
    const newKeyboard = new Keyboard({
      onChange: input => onKeyPress(inputName, input),
      onKeyPress: button => console.log("Button pressed", button),
    });

    setKeyboard(newKeyboard);
    return () => newKeyboard.destroy();
  }, []);

  useEffect(() => {
    if (keyboard) {
      keyboard.setInput(document.querySelector(`input[name="${inputName}"]`).value);
    }
  }, [inputName]);

  return <div className="simple-keyboard" />;
};

export default SimpleKeyboard;
