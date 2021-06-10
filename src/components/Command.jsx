import React from 'react'

function Command(props) {
  let className = 'command' 
  className += (props.active ? ' active': '')
  return (
    <input
      className={className}
      type='text'
      value={props.command}
      onChange={props.onChange}
      onKeyDown={props.onKeyDown}
      ref={props.commandRef}
    />
  ) 
}

export default Command
