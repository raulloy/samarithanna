import './messagebox.css';

const MessageBox = (props) => {
  return (
    <div className={'alert ' + (props.variant || 'info')}>{props.children}</div>
  );
};

export default MessageBox;
