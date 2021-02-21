import React from 'react';

class Checkbox extends React.Component {
  constructor(props){
    super();
    if(props.value!=-1){
      this.value = props.value
    }
    
  }

  handleChange(e, checked){
    if(this.props.onChange){
      this.props.onChange({source:e, value:this.value, checked})
    }
    
  }

  handleClick(e, checked){
    if(this.props.onClick){
      console.log("handleClick:this.value:", this.value)
      this.props.onClick({source:e, value:this.value, checked})
    }
    
  }

    render() {
      return (
          <>
            <div className={`checkbox ${this.props.color}`}>
                <input type="checkbox" id={this.props.checkId}  checked={this.props.checked} 
                onChange={e=>this.handleChange(this, e.target.checked)} 
                onClick={e=>this.handleClick(this, e.target.checked)} />
                <label htmlFor={this.props.checkId}>Obrigatória ( {this.value} )</label>
            </div>
          </>
      );
    }
  }

export default Checkbox;