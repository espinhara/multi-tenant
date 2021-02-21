import React from 'react';

class Switch extends React.Component {
  handleChange(checked) {
    if(this.props.onChange){
      this.props.onChange({checked});
    }
  }
  render() {
    return (
      <>
        <div className={`switch-container ${this.props.className}`}>
            <label className="mr-1" htmlFor={this.props.switchId}>{this.props.label}</label>
            <div className="switch">
                <input type="checkbox" id={this.props.switchId} defaultChecked={this.props.checked} onClick={e=>this.handleChange(!this.props.checked)} />
            <label htmlFor={this.props.switchId}></label>
            </div>
        </div>
      </>
    );
  }
}

export default Switch;