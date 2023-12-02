import axios from "axios";

jest.mock("axios");

beforeAll(async () => {
  process.env.JWT_KEY = "secret";
});

beforeEach(async () => {
  mockClear();
});

afterAll(async () => {});

function mockClear() {
  (axios.get as jest.Mock).mockClear();
  (axios.post as jest.Mock).mockClear();
}
