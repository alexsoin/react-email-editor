import React, {Component} from 'react'
import {render} from 'react-dom'
import styled, { createGlobalStyle } from 'styled-components'

import Example from '../../src'
import sample from './sample.json'

const GlobalStyle = createGlobalStyle`
  html, body {
    margin: 0;
    padding: 0;
    height: 100%;
    font-family: Arial, "Helvetica Neue", Helvetica, sans-serif;
  }

  #demo {
    height: 100%;
  }
`

const Container = styled.div`
  display: flex;
  flex-direction: column;
  position: relative;
  height: 100%;
`

const Bar = styled.div`
  flex: 1;
  background-color: #D6D9DC;
  color: #FFF;
  padding: 10px;
  display: flex;
  max-height: 40px;

  h1 {
    flex: 1;
    font-size: 16px;
    text-align: left;
    color: #333;
    font-size: 1.3em;
    line-height: 1;
    margin-top: 8px;
    margin-bottom: 0;
  }

  button {
    flex: 1;
    padding: 10px;
    margin-left: 10px;
    font-size: 14px;
    font-weight: bold;
    background-color: #84a616;
    color: #FFF;
    border: 0px;
    max-width: 200px;
    cursor: pointer;
  }
  .btn--type1 {
    background-color: #165da6;
  }
  #out {
    display:none;
  }
  .custom-file-upload > input[type="file"] {
    display: none;
  }
  .custom-file-upload {
    flex: 1;
    padding: 10px;
    margin-left: 10px;
    font-size: 14px;
    font-weight: bold;
    background-color: #165da6;
    color: #FFF;
    border: 0px;
    max-width: 200px;
    cursor: pointer;
    text-align: center;
    line-height: 1.5;
}
`

class Demo extends Component {
  render() {
    return (
      <React.Fragment>
        <GlobalStyle />

        <Container>
          <Bar>
            <h1>Конструктор email писем</h1>

            <label className="custom-file-upload">
              <input type="file"
              name="myFile"
              id="myFile"
              onChange={this.uploadFile} />
              <span id="upload">Выберите файл...</span>
            </label>
            <button className="btn--type1" onClick={this.loadFileDesign}>Загрузить разметку</button>

            
            <button onClick={this.saveDesign}>Сохранить разметку</button>
            <button onClick={this.exportHtml}>Сохранить HTML</button>
            <textarea id="out"></textarea>
          </Bar>

          <Example
            ref={editor => this.editor = editor}
            onLoad={this.onLoad}
            onDesignLoad={this.onDesignLoad}
          />
        </Container>
      </React.Fragment>
    )
  }

  constructor(props) {
    super(props)
    this.uploadFile = this.uploadFile.bind(this);
  }
  
  uploadFile(event) {
    var fullPath = document.getElementById('myFile').value;
    if (fullPath) {
        var startIndex = (fullPath.indexOf('\\') >= 0 ? fullPath.lastIndexOf('\\') : fullPath.lastIndexOf('/'));
        var filename = fullPath.substring(startIndex);
        if (filename.indexOf('\\') === 0 || filename.indexOf('/') === 0) {
            filename = filename.substring(1);
        }
        console.log(filename);
        document.getElementById('upload').innerHTML = filename;
    }

    let file = event.target.files[0];
    var reader = new FileReader()
    reader.onload = function() {
      document.getElementById('out').innerHTML = reader.result
    }
    reader.readAsText(file);
  }

  loadFileDesign = () => {
    let json = JSON.parse(document.getElementById('out').textContent);
    this.editor.loadDesign(json);
  }

  onLoad = () => {
    // this.editor.addEventListener('onDesignLoad', this.onDesignLoad)
    this.editor.loadDesign(sample)
  }

  saveDesign = () => {
    this.editor.saveDesign(design => {  
      let d=new Date();
      let day=d.getDate();
      let month=d.getMonth() + 1;
      let year=d.getFullYear();

      let getDate = day + "_" + month + "_" + year;

      const element = document.createElement("a");
      const file = new Blob([JSON.stringify(design)], {type: 'json/plain'});
      element.href = URL.createObjectURL(file);
      element.download = "DesignEmail-"+getDate+".json";
      document.body.appendChild(element); // Required for this to work in FireFox
      element.click();
    })
  }

  exportHtml = () => {
    this.editor.exportHtml(data => {
      let d=new Date();
      let day=d.getDate();
      let month=d.getMonth() + 1;
      let year=d.getFullYear();

      let getDate = day + "_" + month + "_" + year;
      
      const { design, html } = data
      
      const element = document.createElement("a");
      const file = new Blob([html], {type: 'html/plain'});
      element.href = URL.createObjectURL(file);
      element.download = "HtmlEmail-"+getDate+".html";
      document.body.appendChild(element); // Required for this to work in FireFox
      element.click();
    })
  }

  onDesignLoad = (data) => {
    console.log('onDesignLoad', data)
  }
}

render(<Demo/>, document.querySelector('#demo'))
