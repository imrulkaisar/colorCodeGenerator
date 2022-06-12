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
let presetsArea = document.querySelector('.presets-area')
let presets = document.querySelector('.presets')
let customPresets = document.querySelector('.custom-preset')
let clearPresetColorsBtn = document.getElementById('clear-preset')

let presetColors = [
    '#1abc9c',
    '#2ecc71',
    '#3498db',
    '#9b59b6',
    '#34495e',
    '#f39c12',
    '#d35400',
    '#e74c3c',
    '#ecf0f1',
    '#95a5a6'
]

let customPresetColors = []

// Document Ready function

window.onload = () => {
    main()
    defaultAction()
}

// Main Function

function main(){

    // Generate a New Color
    generateNewColorBtn.addEventListener('click', generateNewColor)

    // Generate a New Color by clicking space bar
    window.addEventListener('keypress', (e) => {
        if(e.key === ' ' && e.target.id !== 'hex-input'){
            let color = colorGenerator()
            printResult(color)
        }
    })

    // Change value by hex input
    hexInput.addEventListener('input', changeValueByInput)

    // Change value by slider
    changeBySlider(redSlider, redValue)
    changeBySlider(greenSlider, greenValue)
    changeBySlider(blueSlider, blueValue)

    // Copy preset code 
    presetsArea.addEventListener('click', copyPresetCode)

    // Save as Preset color
    savePresetBtn.addEventListener('click', createNewPreset)

    // Clear preset colors
    clearPresetColorsBtn.addEventListener('click', function(){
        customPresetColors = []
        localStorage.removeItem('printedColors')
        removeChild(customPresets)
        printMessage('Cleared!')
    })
    
}

// Default Behaviers
function defaultAction(){

    let color = colorGenerator()
    printResult(color)

    createPresets(presets, presetColors)

    let printedColors = JSON.parse(localStorage.getItem('printedColors'))
    createPresets(customPresets, printedColors)
    customPresetColors.push(...printedColors)
    
}


// Event Listener Function

function generateNewColor(){
    let color = colorGenerator()
    printResult(color)
    playClickSound('./src/click2.mp3')
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

function changeBySlider(target, print){ 
    target.addEventListener('input', printResultBySlider)
}

function copyPresetCode(e){
    let target = e.target
    if(target.className === 'preset-color'){
        let color = target.getAttribute('data-color').toUpperCase()
        navigator.clipboard.writeText(color)
        printResult(hexToRgb(color))
        printMessage(color + ' Copied!')
        playClickSound('./src/click.wav')
    }
}

function createNewPreset(e){
    let color = e.target.getAttribute('color-data')
    if( !customPresetColors.includes(color) ){
        removeChild(customPresets)
        customPresetColors.push(color)

        let last10Colors= customPresetColors.slice(-10)
        localStorage.setItem('printedColors', JSON.stringify(last10Colors))

        createPresets(customPresets, last10Colors)

        printMessage('Done!')
        playClickSound('./src/click2.mp3')
    } else {
        printMessage('Already added!')
    }
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
    savePresetBtn.setAttribute('color-data', hex)
    hexInput.value = hex

    redSlider.value = color.red
    greenSlider.value = color.green
    blueSlider.value = color.blue
    
    redValue.innerText = color.red
    greenValue.innerText = color.green
    blueValue.innerText = color.blue



}

/**
 * This function will copy color code
 * @param {object} selector
 * @param {string} value 
 */
function copyColor(selector, value){
    selector.addEventListener('click', function(){
        navigator.clipboard.writeText(value)
        printMessage( value + ' Copied!')
        playClickSound('./src/click.wav')
    })
}

function printMessage(text){
    message.innerText = text
    message.style.opacity = 1
    setTimeout(function(){
        message.innerText = ''
        message.style.opacity = 0
    }, 1000)
}

function inputColors(bg, text){
    hexInput.style.backgroundColor = bg
    hexInput.style.color = text
}

/**
 * create a element for color preset
 * @param {string} color 
 */
function createPresetElement(color){
    let presetElement = document.createElement('div')
    presetElement.className = 'preset-color'
    presetElement.style.backgroundColor = color
    presetElement.setAttribute('data-color', color)

    return presetElement
}

/**
 * Display presets into document
 * @param {object} parent 
 * @param {array} colors 
 */
function createPresets(parent, colors){
    colors.forEach((value) => {
        let child = createPresetElement(value)
        parent.prepend(child)
    })
}

function removeChild(parent){
    let child = parent.lastElementChild; 
    while (child) {
        parent.removeChild(child);
        child = parent.lastElementChild;
    }
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
        return makeTwoChar(decimal).toUpperCase()
    })
    return codes[0] + codes[1] + codes[2]
}

function playClickSound(src){
    let file = new Audio(src)
    file.valume = 0.1;
    file.play()
}