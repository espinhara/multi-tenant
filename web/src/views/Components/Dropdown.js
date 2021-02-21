import React from 'react';


class Dropdown extends React.Component {

    componentDidMount() {
        document.addEventListener('mousedown', this.handleClick, false);
    }

    componentWillUnmount() {
        document.removeEventListener('mousedown', this.handleClick, false);
    }

    handleClick = (e) => {
        if (!this.node.contains(e.target)) {
            this.removeClass();
            return
        }
    }

    state = {
        active: "",
    };

    toggleClass = () => {
        this.setState({ active: this.state.active === "" ? "active" : "" });
    };

    removeClass = () => {
        this.setState({ active: this.state = ""});
    };

    render() {

      return (
          <>
            <span ref={node => this.node = node} className={`dropdown ${ this.props.y } ${ this.props.dense ? 'dense' : null } ${ this.props.x } ${ this.props.icon } ${this.state.active}`}>
                <span onClick={this.toggleClass} onBlur={this.removeClass} className="trigger">
                    {this.props.trigger}
                </span>
                <div className="dropdown-content">
                    {/* Subheader */}
                    {this.props.title && <div className="subheader">{this.props.title}</div>}
                    {/* Dropdown items */}
                    {
                        this.props.items &&
                        this.props.items.map(
                            (item,index) => {
                                return (
                                    <div key={index} onClick={() => { this.props.itemAction.bind(); this.handleClick(this)}} className={`dropdown-content-item ${ item.color }`}>
                                        <span className="dropdown-item-icon">
                                            <i className={`feather ${ item.icon }`}></i>
                                        </span>
                                        {item.name}
                                    </div>
                                );
                            }
                        )
                    }
                    {this.props.children}
                </div>
            </span>
          </>
      );
    }
  }

export default Dropdown;