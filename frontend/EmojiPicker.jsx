import React, { useState } from 'react';
import { Picker } from 'emoji-mart';
import 'emoji-mart/css/emoji-mart.css';

function EmojiPicker() {
  const [selectedEmoji, setSelectedEmoji] = useState(null);

  const addEmoji = (emoji) => {
    setSelectedEmoji(emoji.native);
  };

  return (
    <div>
      <h2>Select an Emoji</h2>
      <Picker onSelect={addEmoji} />
      {selectedEmoji && (
        <div style={{ marginTop: '20px', fontSize: '24px' }}>
          You selected: {selectedEmoji}
        </div>
      )}
    </div>
  );
}

export default EmojiPicker;
