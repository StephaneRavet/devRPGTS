import $ from 'jquery'
import './style.css'

// Enum pour les opérations disponibles
enum Operation {
  Add = 'addition',
  Subtract = 'soustraction',
  Multiply = 'multiplication',
  Divide = 'division'
}

// Variables pour stocker l'historique
let calculations: string[] = []
let currentResult: number = 0

// Variables pour stocker les valeurs courantes
let currentNum1: string = ''
let currentNum2: string = ''
let currentOperation: Operation = Operation.Add

// Fonction pour effectuer un calcul
function calculate(a: number, b: number, operation: Operation): number {
  let result: number = 0

  switch (operation) {
    case Operation.Add:
      result = a + b
      break
    case Operation.Subtract:
      result = a - b
      break
    case Operation.Multiply:
      result = a * b
      break
    case Operation.Divide:
      if (b === 0) {
        throw new Error("Division par zéro impossible")
      }
      result = a / b
      break
  }

  const calculation: string = `${a} ${operation} ${b} = ${result}`
  calculations.push(calculation)
  return result
}

// Fonction pour afficher la calculatrice
function displayCalculator(): void {
  const app = $('#app')
  if (!app.length) return

  app.html(`
        <div class="max-w-md mx-auto mt-10 p-6 bg-gray-800 rounded-lg shadow-xl">
            <h1 class="text-2xl font-bold text-blue-400 mb-6">Calculatrice</h1>
            
            <div class="space-y-4">
                <div class="grid grid-cols-3 gap-4">
                    <input type="number" id="num1" 
                        class="col-span-1 p-2 bg-gray-700 border border-gray-600 rounded text-white" 
                        placeholder="Nombre 1"
                        value="${currentNum1}">
                    
                    <select id="operation" 
                        class="col-span-1 p-2 bg-gray-700 border border-gray-600 rounded text-white">
                        <option value="${Operation.Add}">+</option>
                        <option value="${Operation.Subtract}">-</option>
                        <option value="${Operation.Multiply}">×</option>
                        <option value="${Operation.Divide}">÷</option>
                    </select>
                    
                    <input type="number" id="num2" 
                        class="col-span-1 p-2 bg-gray-700 border border-gray-600 rounded text-white" 
                        placeholder="Nombre 2"
                        value="${currentNum2}">
                </div>

                <button id="calculateBtn" 
                    class="w-full py-2 bg-blue-500 hover:bg-blue-600 text-white rounded">
                    Calculer
                </button>

                <div class="mt-4 p-4 bg-gray-700 rounded">
                    <p class="text-lg">Résultat: <span id="result">${currentResult}</span></p>
                </div>

                <div class="mt-4">
                    <h2 class="text-lg font-semibold text-blue-400 mb-2">Historique</h2>
                    <ul id="history" class="space-y-2">
                        ${calculations.map(calc => `
                            <li class="p-2 bg-gray-700 rounded">${calc}</li>
                        `).join('')}
                    </ul>
                </div>
            </div>
        </div>
    `)
}

// Initialisation de l'application
$((): void => {
  displayCalculator()

  // Gestionnaire d'événement pour le bouton de calcul
  $(document).on('click', '#calculateBtn', (): void => {
    const num1Input = $('#num1')
    const num2Input = $('#num2')
    const operationSelect = $('#operation')

    if (!num1Input.val() || !num2Input.val()) {
      alert('Veuillez remplir tous les champs')
      return
    }

    // Sauvegarder les valeurs courantes
    currentNum1 = num1Input.val() as string
    currentNum2 = num2Input.val() as string
    currentOperation = operationSelect.val() as Operation

    try {
      currentResult = calculate(parseFloat(currentNum1), parseFloat(currentNum2), currentOperation)
      displayCalculator()
    } catch (error) {
      alert(error)
    }
  })
})

