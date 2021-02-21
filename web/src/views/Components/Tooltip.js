import React from 'react';

class Tooltip extends React.Component {

    render() {
      return (
          <>
            <span className={`tooltip ${ this.props.y } ${ this.props.x } ${ this.props.className }`}>
                    {this.props.trigger}
                <div className="tooltip-content">
                    {this.props.children}
                </div>
            </span>
          </>
      );
    }
  }

export default Tooltip;