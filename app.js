/**
 * Project Name: Color Code Generator
 * Live project: https://imrulkaisar.github.io/colorCodeGenerator/ 
 * Author: Imrul Kaisar
 * Author URL: https://imrulkaisar.com/
 * 
 * Features: 
 * 1) Color Code generator
 * 2) HEX to RGB color code converter
 * 3) Copy HEX color code
 * 4) Copy RGB color code
 * 5) Color Presets
 * 6) Save color as a preset
 */

// Global Veriables
let root = document.getElementById('root')
let generateNewColorBtn = document.getElementById('generateNewColor')
let preview = document.getElementById('preview')
let message = document.querySelector('.message')
let hexCode = document.querySelector('.hex-code')
let rgbCode = document.querySelector('.rgb-code')
let savePresetBtn = document.getElementById('save-preset')
let hexInput = document.getElementById('hex-input')
let redSlider = document.getElementById('red')
let greenSlider = document.getElementById('green')
let blueSlider = document.getElementById('blue')
let redValue = document.querySelector('.red .value')
let greenValue = document.querySelector('.green .value')
let blueValue = document.querySelector('.blue .value')
let presetsArea = document.querySelector('.presets')



// Document Ready function

window.onload = () => {
    main()
    defaultAction()
}

// Main Function

function main(){

    // Generate a New Color
    generateNewColorBtn.addEventListener('click', generateNewColor)

    // Change value by hex input
    hexInput.addEventListener('input', changeValueByInput)

    // Change value by slider
    changeBySlider(redSlider, redValue)
    changeBySlider(greenSlider, greenValue)
    changeBySlider(blueSlider, blueValue)

    function changeBySlider(target, print){ 
        target.addEventListener('input', printResultBySlider)
    }
}

// Default Behaviers
function defaultAction(){

    let color = colorGenerator()
    printResult(color)
    
}


// Event Listener Function

function generateNewColor(){
    let color = colorGenerator()
    printResult(color)
}


function changeValueByInput(e){
    let value = e.target.value
    message.innerText = ''

    inputColors('#ffffff', '#000000')
    
    if(!validColor(value)){
        message.innerText = 'HEX code is not valid'
        inputColors('#ff0000','#ffffff')
        if(value === ''){
            message.innerText = ''
            inputColors('#ffffff', '#000000')
        }
    } else {
        let hex = hexToRgb(value)
        let valueObj = {
            red: hex.red,
            green: hex.green,
            blue: hex.blue
        }
        printResult(valueObj)
    }
}

function printResultBySlider(e){
    let tarValue = e.target.value
    print.innerText = tarValue

    let rgb = {
        red: redSlider.value,
        green: greenSlider.value,
        blue: blueSlider.value
    }

    printResult(rgb)
}

// DOM functions

/**
 * This funciton will print values
 * @param {object} color 
 */

function printResult(color){

    
    let rgb = `rgb(${color.red}, ${color.green}, ${color.blue})`
    let hex = `#${rgbToHex(rgb)}`
    // let hex = `#${makeTwoChar(color.red)}${makeTwoChar(color.green)}${makeTwoChar(color.blue)}`.toUpperCase()

    
    hexCode.innerHTML = `HEX CODE: ${hex} <span id="copy-hex" class="copy"><img src="./src/copy.png" alt="copy" srcset=""></span>`
    rgbCode.innerHTML = `RGB CODE: ${rgb} <span id="copy-rgb" class="copy"><img src="./src/copy.png" alt="copy" srcset=""></span>`

    copyColor(hexCode, hex) 
    copyColor(rgbCode, rgb)

    root.style.backgroundColor = rgb
    preview.style.backgroundColor = rgb
    hexInput.value = hex

    redSlider.value = color.red
    greenSlider.value = color.green
    blueSlider.value = color.blue
    
    redValue.innerText = color.red
    greenValue.innerText = color.green
    blueValue.innerText = color.blue



}

function copyColor(selector, value){
    selector.addEventListener('click', function(){
        navigator.clipboard.writeText(value)
        message.innerText = value + ' Copied'
        message.style.opacity = 1
        setTimeout(function(){
            message.innerText = ''
            message.style.opacity = 0
        }, 1000)
    })
}

function inputColors(bg, text){
    
    hexInput.style.backgroundColor = bg
    hexInput.style.color = text
}


// Util functions

/**
 * Generate a unique color code 
 * @returns {object} 
 */
 function colorGenerator(){
    let red, green, blue

    red = Math.floor(Math.random() * 255 + 1)

    green = Math.floor(Math.random() * 255 + 1)

    blue = Math.floor(Math.random() * 255 + 1)

    return {
        red,
        green,
        blue
    }
}

function makeTwoChar(value){
    let char = value.toString(16)
    return char.length === 1 ? `0${char}`:char
}

function validColor(color){
    let len = color.length
    let code = color.substring(1)
    return (color[0] === '#' && len === 7 && /^[0-9A-Fa-f]{6}$/i.test(code)) ? true : false
}

function hexToRgb(color){
    let hex = color.substring(1)
    let red = parseInt(hex.slice(0, 2), 16)
    let green = parseInt(hex.slice(2, 4).toString(10), 16)
    let blue = parseInt(hex.slice(4, 6), 16)
    return {
        red,
        green,
        blue
    }
}

function rgbToHex(rgb){
    let numbers = rgb.split('(')[1].split(')')[0].split(',')
    let codes = numbers.map( (value) => {
        let decimal = parseInt(value.trim())
        return decimal.toString(16).toUpperCase()
    })
    return codes[0] + codes[1] + codes[2]
}