/// <reference types="cypress" />

// load previously computed paths
const shortestValuePaths = require('../fixtures/shortest')
const draws = require('../fixtures/draws')
const winnerX = require('../fixtures/winner-x')
const winnerO = require('../fixtures/winner-o')

function deserializeEventString(eventString) {
  const [type, payload] = eventString.split(' | ');

  return {
    type,
    ...(payload ? JSON.parse(payload) : {})
  };
}

const eventMap = {
  PLAY: event => {
    const selector = `[data-testid="square-${event.value}"]`
    cy.get(selector).click()
  }
};

const play = (pathConfig) => {
  for (const { state, event: eventString } of pathConfig) {
    if (!eventString) {
      continue;
    }
    const event = deserializeEventString(eventString);
    const realEvent = eventMap[event.type];

    if (realEvent) {
      realEvent(event);
    }
  }
}

describe('Tic Tac Toe', () => {
  beforeEach(() => {
    cy.visit('/')
    // this is how we know the app UI is ready
    cy.contains('h2', /^Player X$/)
  })

  it('player X wins', () => {
    const pathConfig = shortestValuePaths[winnerX[0]]
    play(pathConfig)
    cy.contains('h2', 'Player X wins!')
  })

  it('player O wins', () => {
    const pathConfig = shortestValuePaths[winnerO[0]]
    play(pathConfig)
    cy.contains('h2', 'Player O wins!')
  })

  draws.forEach((targetStateString, k) => {
    it(`plays to a draw ${k}`, () => {
      const pathConfig = shortestValuePaths[targetStateString]
      console.log('testing', pathConfig)

      play(pathConfig)

      // now we should get a draw message
      cy.contains('h2', 'Draw')

    })
  })
})
