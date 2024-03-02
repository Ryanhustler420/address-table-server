import request from "supertest";
import { app } from "../../../app";

const timeout_ms = 5 * 60 * 1000;

it.concurrent(
  "[@concurrent] return error if not data provided",
  async () => {
    const response = await request(app).post("/api/compilers/cpp").expect(400);
    expect(response.body).toHaveProperty("errors");
    expect(response.body.errors[0].message).toContain("\"sources\" is required");
  },
  timeout_ms
);

it.concurrent(
  "[@concurrent] return error if wrong data value provided",
  async () => {
    const response = await request(app)
      .post("/api/compilers/cpp")
      .send({
        sources: [{ name: 'app.cpp', content: false, main: true }],
        input: "",
      })
      .expect(400);

    expect(response.body).toHaveProperty("errors");
    expect(response.body.errors[0].message).toContain("\"sources[0].content\" must be a string");
  },
  timeout_ms
);

it.concurrent(
  "[@concurrent] return error if wrong data key provided",
  async () => {
    const response = await request(app)
      .post("/api/compilers/cpp")
      .send({
        sources: { "abc": "" },
        input: "",
      })
      .expect(400);

    expect(response.body).toHaveProperty("errors");
    expect(response.body.errors[0].message).toContain("\"sources\" must be an array");
  },
  timeout_ms
);

it.concurrent(
  "[@concurrent] return error if wrong data type provided",
  async () => {
    const response = await request(app)
      .post("/api/compilers/cpp")
      .send({
        sources: false,
        input: 0,
      })
      .expect(400);

    expect(response.body).toHaveProperty("errors");
    expect(response.body.errors[0].message).toContain("\"sources\" must be an array");
  },
  timeout_ms
);

it.concurrent(
  "[@concurrent] return error if hit wrong url",
  async () => {
    const response = await request(app)
      .post("/api/compilers/cpp2")
      .send({
        sources: "",
        input: 0,
      })
      .expect(404);

    expect(response.body).toHaveProperty("errors");
    expect(response.body.errors[0].message).toContain("Not found");
  },
  timeout_ms
);

it.concurrent(
  "[@concurrent] return error if hit correct url but wrong method",
  async () => {
    const response = await request(app)
      .get("/api/compilers/cpp")
      .send({
        sources: { 0: "" },
        input: "0",
      })
      .expect(404);

    expect(response.body).toHaveProperty("errors");
    expect(response.body.errors[0].message).toContain("Not found");
  },
  timeout_ms
);

it.concurrent(
  "[@concurrent] return error if provided extra data",
  async () => {
    const response = await request(app)
      .post("/api/compilers/cpp")
      .send({
        sources: [{ name: 'app.cpp', content: "#include <iostream>\n#include <stdio.h>\n\nusing namespace std;\n\nint main() {\n\tcout << \"Welcome to xCodeClazz\";\n\treturn 0;\n}\n", main: true }],
        input: "0",
        animal: false,
      })
      .expect(400);

    expect(response.body).toHaveProperty("errors");
    expect(response.body.errors[0].message).toContain("animal");
  },
  timeout_ms
);

it.concurrent(
  "[@concurrent] return error if provided less data",
  async () => {
    const response = await request(app)
      .post("/api/compilers/cpp")
      .send({
        input: "0",
        animal: false,
      })
      .expect(400);

    expect(response.body).toHaveProperty("errors");
    expect(response.body.errors[0].message).toContain("\"sources\" is required");
  },
  timeout_ms
);

it.concurrent(
  "[@concurrent] return result if valid input provided",
  async () => {
    const response = await request(app)
      .post("/api/compilers/cpp")
      .send({
        sources: [{ name: 'app.cpp', content: "#include <iostream>\n\nusing namespace std;\n\nint main() {\n\tint a;\n\tcout << \"Enter a number: \" << endl;\n\tcin >> a;\n\tcout << a;\n\n\treturn 0;\n}", main: true }],
        input: "1",
      })
      .expect(200);
      
    expect(response.body.result.executionResult.stdout).toEqual("Enter a number: \n1");
    expect(response.body.result.executionResult.stderr).toEqual('');
    expect(response.body.result.executionResult.exitCode).toEqual(0);

    expect(response.body.result.lang).toEqual('cpp');
    expect(response.body.result.isSucceed).toEqual(true);
  },
  timeout_ms
);

it.concurrent(
  "[@concurrent] compile the code and return success response",
  async () => {
    const response = await request(app)
      .post("/api/compilers/cpp")
      .send({
        sources: [{ name: 'app.cpp', content: "#include <iostream>\n\nusing namespace std;\n\nint main() {\n\tint a = 5;\n\tcout << a;\n\n\treturn 0;\n}", main: true }],
        input: "",
      })
      .expect(200);

    expect(response.body.result.executionResult.stdout).toEqual("5");
    expect(response.body.result.executionResult.stderr).toEqual('');
    expect(response.body.result.executionResult.exitCode).toEqual(0);

    expect(response.body.result.lang).toEqual('cpp');
    expect(response.body.result.isSucceed).toEqual(true);
  },
  timeout_ms
);

it.concurrent(
  "[@concurrent] return syntax error while compiling the code and return error message",
  async () => {
    const response = await request(app)
      .post("/api/compilers/cpp")
      .send({
        sources: [{ name: 'app.cpp', content: "#include <iostream>\n\nint main() {\n\tint a = 5;\n\tcout << a;\n\n\treturn 0;\n}", main: true }],
        input: "",
      })
      .expect(200);

    expect(response.body.result.executionResult.stdout).toEqual('');
    expect(response.body.result.executionResult.stderr).toContain('^');
    expect(response.body.result.executionResult.exitCode).toEqual(1);

    expect(response.body.result.lang).toEqual('cpp');
    expect(response.body.result.isSucceed).toEqual(false);
  },
  timeout_ms
);

it.concurrent(
  "[@concurrent] long output response will be limited",
  async () => {
    const response = await request(app)
      .post("/api/compilers/cpp")
      .send({
        sources: [{ name: 'app.cpp', content: "#include <iostream>\n\nusing namespace std;\n\nint main() {\n\t for (int i = 0; i < 10000; ++i) { std::cout << i; } \n\n\treturn 0;\n}", main: true }],
        input: "",
      })
      .expect(200);

    expect(response.body.result.executionResult.stdout.length).toEqual(1000);
    expect(response.body.result.executionResult.stderr).toEqual('');
    // expect(response.body.result.executionResult.exitCode).toEqual(null);

    expect(response.body.result.lang).toEqual('cpp');
    expect(response.body.result.isSucceed).toEqual(true);
  },
  timeout_ms
);