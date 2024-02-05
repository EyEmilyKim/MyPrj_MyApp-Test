import React from 'react';
// CSS definition is in MyPage.css
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFloppyDisk } from '@fortawesome/free-solid-svg-icons';

export default function MyFeatSave(props) {
  const toggleEditing = props.toggleEditing;

  const handleSaveUser = () => {
    console.log('handleSaveUser called');
  };

  return (
    <div className="myPage-each-feat" onClick={handleSaveUser}>
      <FontAwesomeIcon icon={faFloppyDisk} />
      <p>저장</p>
    </div>
  );
}
