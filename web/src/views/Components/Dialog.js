import React from 'react';

class Dialog extends React.Component {
    constructor(props) {
        super(props);
    }

    componentDidMount() {
        window.addEventListener("click", this.windowOnClick);
    }
    windowOnClick = (event) => {
        var modal = document.querySelector(".dialog.active");
        if (event.target === modal && this.props.dismissible) {
            this.props.onHide();
        }
    }

    render() {

        return (
            <>
                <div className={`dialog ${this.props.size} ${this.props.scrollable ? 'scrollable' : ''} ${this.props.show ? 'active' : ''}`}>
                    <div className={`dialog-content ${this.props.size}`}>
                        {!this.props.header &&
                            <div className="dialog-content-header">
                                <button className="btn btn-white icon close" onClick={this.props.onHide.bind()}>&times;</button>
                                <h4>{this.props.title}</h4>
                            </div>
                        }
                        {this.props.header}
                        <div className="dialog-content-body">
                            {this.props.body}
                        </div>
                        <div className="dialog-content-footer">
                            {this.props.footer}
                        </div>
                    </div>
                </div>
            </>
        );
    }
}


export default Dialog;