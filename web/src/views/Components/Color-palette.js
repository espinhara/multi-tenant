import React from 'react';
import ResearchHelper from '../../helpers/researchHelper'
class ColorPalette extends React.Component {
    state={
        idResearch:this.props.researchId, 
      /* title:this.props.researchTitle,  */
     
     
        idPalette: this.props.paletteId,/* ,
        name:this.props.name ,
        maincolor: this.props.maincolor,
        backcolor: this.props.backcolor,
        textcolor: this.props.textcolor */
        currentPalette: this.props.researchPalette
     
    }
    render() {            
     const handleClick = (e) =>{
       ResearchHelper.savePalette(this.state.idResearch, this.state.idPalette).then((res)=>{
          let colors = JSON.parse(res.config.data)
          this.props.onChange(colors);
        })
     }
      return (
          <>
            <div onClick={(event) => handleClick(event)} value={this.props.paletteId} id={this.props.researchId} 
              className={`color-palette ${this.props.researchPalette == this.props.paletteId ? 'active': ''}`}>
                <div className="color-palette-title">
                    {this.props.name}
                </div>
                <div className="colors">
                    <div className="color" title="Principal" style={{background:this.props.maincolor}}></div>
                    <div className="color" title="Fundo" style={{background:this.props.backcolor}}></div>
                    <div className="color" title="Texto" style={{background:this.props.textcolor}}></div>
                </div>
            </div>
          </>
      );
    }
  }

export default ColorPalette;