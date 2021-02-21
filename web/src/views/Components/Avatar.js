import React from 'react';

var md5 = require('md5');

class Avatar extends React.Component {

    render() {
      return (
          <>
            <div className={`avatar ${ this.props.size } ${ this.props.user == 1 && !this.props.pending ? 'admin' : this.props.user == 2 && !this.props.pending ? 'user' : ''} ${this.props.pending?'pending':''}`} data-initials={this.props.initials}>
                {this.props.email &&
                    <img src={`https://www.gravatar.com/avatar/`+md5(this.props.email)+'?d=blank&s=200'} srcSet={`https://www.gravatar.com/avatar/`+md5(this.props.email)+'?d=blank&s=400 2x'} alt=""/>
                }
                {this.props.children}
            </div>
          </>
      );
    }
  }

export default Avatar;