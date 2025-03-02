import { expect, it, describe } from 'vitest'
import { analyseBatch } from '@/utils/script/analyseChat'
import fs from 'fs'
import path from 'path'
import { performance } from 'perf_hooks'

const baseFilePath = path.resolve(__dirname, '../../testChats')
const filePaths = ['chat-nl.txt', 'chat-de.txt', 'chat-es.txt', 'chat-en.txt', 'chat-it.txt', 'chat-fr.txt', 'chat-pr.txt']
const logFilePath = path.resolve(__dirname, '../../performanceLogs-new.json') // File to store performance logs

describe('Chat Analysis', () => {
  it('should output the same number of messages for different languages of the same chat', async () => {
    const startTime = performance.now() // Start timer
    const analysedChats = await Promise.all(
      filePaths.map(async (filePath) => {
        const chatFilePath = path.resolve(baseFilePath, filePath)
        const chatData = fs.readFileSync(chatFilePath, 'utf-8')
        const analysed = await analyseChatString(chatData)

        return analysed
      })
    )

    const endTime = performance.now() // End timer
    const totalTime = (endTime - startTime).toFixed(2)
    console.log(`Total analysis time: ${totalTime} ms`)
    logPerformance(totalTime)

    expect(Number(totalTime)).toBeLessThan(500 * filePaths.length)

    analysedChats.forEach((chat, index) => {
      console.log(`Checking chat index ${index}`)
      try {
        expect(chat.authors.length).toBe(analysedChats[0].authors.length)
        expect(chat.messages.length).toBe(analysedChats[0].messages.length)
        expect(chat.messages.every(({ date }) => !isNaN(new Date(date).getTime()))).toBe(true)

        expect(new Date(chat.startDate).getTime()).toBe(new Date(analysedChats[0].startDate).getTime())
        expect(new Date(chat.endDate).getTime()).toBe(new Date(analysedChats[0].endDate).getTime())
        expect(chat.events.length).toBe(analysedChats[0].events.length)
        expect(chat.polls.length).toBe(analysedChats[0].polls.length)
      } catch (error) {
        console.error(`Error in chat index ${index}:`, error)
        throw error
      }
    })
  })
})

// Helper function (no changes from your original code)
async function analyseChatString(chat: string) {
  const state = { authors: [], messages: [], events: [], polls: [], startDate: undefined, endDate: undefined, id: 0 } // Shared state for analysis

  const batchSize = 330000
  let batchIndex = 0
  const lines = chat.split('\n')
  const lang = detectLanguage(lines[0])
  const totalAmountBatches = Math.ceil(lines.length / batchSize)
  expect(lang).not.toBe('')

  for (let i = 0; i < lines.length / batchSize; i++) {
    const batch = lines.slice(i * batchSize, (i + 1) * batchSize)
    batchIndex++
    await analyseBatch(batch, state, batchIndex === totalAmountBatches, lang)

    await new Promise((resolve) => setTimeout(resolve, 1))
  }

  return state
}

function detectLanguage(firstLine: string) {
  const encryptionMessages = {
    'worden end-to-end versleuteld': 'nl',
    'Messages and calls are end-to-end encrypted.': 'en',
    'I messaggi e le chiamate sono crittografati end-to-end.': 'it',
    'Los mensajes y las llamadas están cifrados de extremo a extremo': 'es',
    'sind Ende-zu-Ende-verschlüsselt': 'de',
    'Les messages et les appels sont chiffrés de bout en bout': 'fr',
    'criptografadas de ponta a ponta. ': 'pt-br',
    'As mensagens e chamadas são encriptadas ponto a ponto.': 'pt-pt',
    'Сообщения и звонки защищены сквозным шифрованием. Никто вне этого чата, даже WhatsApp, не может их прочитать или прослушать.': 'ru',
  }

  let detectedLanguage = ''

  Object.entries(encryptionMessages).forEach(([key, value]) => {
    if (firstLine.includes(key)) {
      detectedLanguage = value
    }
  })
  if (!detectedLanguage) {
    console.log('Language not detected:', firstLine)
  }
  return detectedLanguage
}

function logPerformance(totalTime: number) {
  // Log performance time to JSON file
  const logEntry = {
    timestamp: new Date().toISOString(),
    totalTime,
    fileCount: filePaths.length,
  }

  try {
    if (!fs.existsSync(logFilePath)) {
      fs.writeFileSync(logFilePath, JSON.stringify([logEntry], null, 2))
    } else {
      const existingLogs = JSON.parse(fs.readFileSync(logFilePath, 'utf-8'))
      const lastLog = existingLogs[existingLogs.length - 1]
      if (Math.abs(lastLog.totalTime - totalTime) < 50) {
        console.log('No notable change in perofrmance time. Skipping log entry.')
        return
      }
      existingLogs.push(logEntry)
      fs.writeFileSync(logFilePath, JSON.stringify(existingLogs, null, 2))
    }
    console.log('Performance log saved.')
  } catch (error) {
    console.error('Error saving performance log:', error)
  }
}
