/**
 * Project Name: Color Code Generator
 * Live project: https://imrulkaisar.github.io/colorCodeGenerator/ 
 * @author: Imrul Kaisar
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

// Global Variables & DOM references 
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

/**
 * Pre-set color codes 
 * @type {Array<string>}
 */
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

/**
 * Custom Pre-set color codes - It will be added manually by user 
 * @type {Array<string>} 
 */
let customPresetColors = []

/**
 * @desc Document Ready function
 */

window.onload = () => {
    main()
    defaultAction()
}

/**
 * @desc Main Function - It will hold all the functions
 */ 
function main(){

    /**
     * @desc Clicking on 'Generate a new Color' Button it will Generate a New Color
     */
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
    changeBySlider(redSlider)
    changeBySlider(greenSlider)
    changeBySlider(blueSlider)

    // Copy preset code 
    presetsArea.addEventListener('click', copyPresetCode)

    // Save as Preset color
    savePresetBtn.addEventListener('click', createNewPreset)

    // Clear preset colors
    clearPresetColorsBtn.addEventListener('click', clearPresetColors)
    
}

/**
 * @desc Default Behaviors - This function will run when this app will run first time.
 */
function defaultAction(){

    let color = colorGenerator()
    printResult(color)

    createPresets(presets, presetColors)

    let printedColors = JSON.parse(localStorage.getItem('printedColors'))
    createPresets(customPresets, printedColors)
    customPresetColors.push(...printedColors)
    
}


// Event Listener Function

/**
 * @desc Generate a new color code and print it on the app with click sound
 */
function generateNewColor(){
    let color = colorGenerator()
    printResult(color)
    playClickSound('./src/click2.mp3')
}

/**
 * @description Print result by changing/inputting value on Hex input field
 * @param {Object} e - Event
 */

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

/**
 * @desc It will take value from sliders and print the result
 * @param {object} e - Event
 */
function printResultBySlider(e){
    let tarValue = e.target.value
    // print.innerText = tarValue

    let rgb = {
        red: redSlider.value,
        green: greenSlider.value,
        blue: blueSlider.value
    }

    printResult(rgb)
}

/**
 * @desc Changing slider value it will update result
 * @param {Object} target - Dome selector (Range input field) 
 */
function changeBySlider(target){ 
    target.addEventListener('input', printResultBySlider)
}

/**
 * @desc 
 * * Copy selected preset's color code to clipboard 
 * * Update the color code on the app 
 * * Show "__ Copied" message 
 * * Play click sound
 * @param {Object} e - Event
 */
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

/**
 * @desc
 * * Take current color code and push it to customPresetColors array 
 * *) Slice last 10 color code from customPresetColors array and store it to browser localStorage 
 * * Create custom preset 
 * * Show "Done! Message" 
 * * Play click sound 
 * * Prevent depilation of same color code
 * @param {Object} e - Event
 */
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

/**
 * @desc
 * * Make customPresetColors Array empty 
 * * Remove custom presets from localStorage
 * * Print "Cleared!" message
 */
function clearPresetColors(){
    customPresetColors = []
    localStorage.removeItem('printedColors')
    removeChild(customPresets)
    printMessage('Cleared!')
}

// DOM functions

/**
 * @desc This function will print color value
 * @param {{red: number, green: number, blue: number}} color 
 */

function printResult(color){

    /**
     * @decs Generate RGB Color code
     */
    let rgb = `rgb(${color.red}, ${color.green}, ${color.blue})`

    /**
     * @decs Generate HEX Color code
     */
    let hex = `#${rgbToHex(rgb)}`

    
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
 * @desc This function will copy the selected color code
 * @param {Object} selector - (DOM) who is holding the color code
 * @param {string} value - Color Code
 */
function copyColor(selector, value){
    selector.addEventListener('click', function(){
        navigator.clipboard.writeText(value)
        printMessage( value + ' Copied!')
        playClickSound('./src/click.wav')
    })
}

/**
 * @desc Print a message given by argument
 * @param {string} text - The text need to be printed
 */
function printMessage(text){
    message.innerText = text
    message.style.opacity = 1
    setTimeout(function(){
        message.innerText = ''
        message.style.opacity = 0
    }, 1000)
}

/**
 * @desc Change HEX Code input colors
 * @param {string} bg - (Color Code) Background Color
 * @param {string} text - (Color Code) Text Color
 */
function inputColors(bg, text){
    hexInput.style.backgroundColor = bg
    hexInput.style.color = text
}

/**
 * @desc Create an element for custom preset color
 * @param {string} color - (Color Code)
 * @returns Preset Element
 */
function createPresetElement(color){
    let presetElement = document.createElement('div')
    presetElement.className = 'preset-color'
    presetElement.style.backgroundColor = color
    presetElement.setAttribute('data-color', color)

    return presetElement
}

/**
 * @desc Display presets into document
 * @param {Object} parent - (DOM Object) Selector who holds preset colors
 * @param {array} colors - Array of color code
 */
function createPresets(parent, colors){
    colors.forEach((value) => {
        let child = createPresetElement(value)
        parent.prepend(child)
    })
}

/**
 * @desc Remove all DOM children of parent
 * @param {Object} parent - (DOM Object) Selector who holds preset colors
 */
function removeChild(parent){
    let child = parent.lastElementChild; 
    while (child) {
        parent.removeChild(child);
        child = parent.lastElementChild;
    }
}

// Util functions

/**
 * @desc Generate a unique color code 
 * @returns {{red: number, green: number, blue: number}} - An object of colors
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

/**
 * @desc 
 * * Convert decimal to HEX
 * * Make single character to double character
 * @param {number} value - Number between (0 - 255)
 * @returns {number} Two digit HEX number
 */
function makeTwoChar(value){
    let char = value.toString(16)
    return char.length === 1 ? `0${char}`:char
}

/**
 * @desc Check color code is valid or not
 * @param {string} color - HEX color code
 * @returns {boolean}
 */
function validColor(color){
    let len = color.length
    let code = color.substring(1)
    return (color[0] === '#' && len === 7 && /^[0-9A-Fa-f]{6}$/i.test(code)) ? true : false
}

/**
 * @desc Convert HEX to RGB Object 
 * @param {string} color - HEX color code
 * @returns {{red: number, green: number, blue: number}} An object of colors
 */
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

/**
 * @desc Convert RGB color to HEX Color code
 * @param {string} rgb - RGB color code
 * @returns {string} HEX Color code without '#'
 */
function rgbToHex(rgb){
    let numbers = rgb.split('(')[1].split(')')[0].split(',')
    let codes = numbers.map( (value) => {
        let decimal = parseInt(value.trim())
        return makeTwoChar(decimal).toUpperCase()
    })
    return codes[0] + codes[1] + codes[2]
}

/**
 * @desc Pay a sound in volume 20%
 * @param {*} src - Audio file link
 */
function playClickSound(src){
    let file = new Audio(src)
    file.volume = 0.2;
    file.play()
}