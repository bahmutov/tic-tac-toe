/// <reference types="cypress" />

// load previously computed paths
const shortestValuePaths = require('../fixtures/shortest')
const draws = require('../fixtures/draws')

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

describe('Tic Tac Toe', () => {
  beforeEach(() => {
    cy.visit('/')
  })

  draws.forEach((targetStateString, k) => {
    it(`plays to a draw ${k}`, () => {
      const pathConfig = shortestValuePaths[targetStateString]
      console.log('testing', pathConfig)

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

      // now we should get a draw message
      cy.contains('h2', 'Draw')

    })
  })
})
