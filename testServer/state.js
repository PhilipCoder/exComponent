import testData from "./ExportJson.js";

const  contactMethods = [
    { id: 1, label: "Email" },
    { id: 2, label: "Phone" },
    { id: 3, label: "Address" }
]

class demoState {
    person = {
        peronalDetails:{
        name: "Philip"
        }
    }
    allPeople = testData
    name = "Hello World"
    disableInput = false
    contactMethods = contactMethods
    dropDownAVal = null
    dropDownBVal = 2
    dropDownCVal = contactMethods[1]
}

export default demoState