import fetchMock from 'jest-fetch-mock'
fetchMock.enableMocks()
Object.defineProperty(window, 'scrollTo', { value: jest.fn(), writable: true });
