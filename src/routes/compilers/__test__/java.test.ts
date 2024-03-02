import request from "supertest";
import { app } from "../../../app";

const timeout_ms = 5 * 60 * 1000;

it.concurrent(
  "[@concurrent] return error if not data provided",
  async () => {
    const response = await request(app).post("/api/compilers/java").expect(400);
    expect(response.body).toHaveProperty("errors");
    expect(response.body.errors[0].message).toContain("\"sources\" is required");
  },
  timeout_ms
);

it.concurrent(
  "[@concurrent] return error if wrong data value provided",
  async () => {
    const response = await request(app)
      .post("/api/compilers/java")
      .send({
        sources: [{ name: 'Main.java', content: false, main: true }],
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
      .post("/api/compilers/java")
      .send({
        sources: [{ animal: 'Main.java', content: "public class Main {\n\tpublic static void main(String[] args) {\n\t\tSystem.out.println(5);\n\t}\n}", main: true }],
        input: "",
      })
      .expect(400);

    expect(response.body).toHaveProperty("errors");
    expect(response.body.errors[0].message).toContain("\"sources[0].name\" is required");
  },
  timeout_ms
);

it.concurrent(
  "[@concurrent] return error if wrong data type provided",
  async () => {
    const response = await request(app)
      .post("/api/compilers/java")
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
      .post("/api/compilers/java2")
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
      .get("/api/compilers/java")
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
      .post("/api/compilers/java")
      .send({
        sources: [{ name: 'Main.java', content: "public class Main {\n\tpublic static void main(String[] args) {\n\t\tSystem.out.println(5);\n\t}\n}", main: true }],
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
      .post("/api/compilers/java")
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

it.skip(
  "[@concurrent] return result if valid input provided",
  async () => {
    const response = await request(app)
      .post("/api/compilers/java")
      .send({
        sources: [{ name: 'Main.java', content: "import java.util.Scanner;\n\npublic class Main {\n\tpublic static void main(String[] args) {\n\t\tScanner sc = new Scanner(System.in);\n\t\tSystem.out.println(sc.next());\n\t}\n}", main: true }],
        input: "1",
      })
      .expect(200);

    expect(response.body.result.executionResult.stdout).toEqual("1\n");
    expect(response.body.result.executionResult.stderr).toEqual('');
    expect(response.body.result.executionResult.exitCode).toEqual(0);

    expect(response.body.result.lang).toEqual('java');
    expect(response.body.result.isSucceed).toEqual(true);
  },
  timeout_ms
);

it.skip(
  "[@concurrent] compile the code and return success response",
  async () => {
    const response = await request(app)
      .post("/api/compilers/java")
      .send({
        sources: [{ name: 'Main.java', content: "public class Main {\n\tpublic static void main(String[] args) {\n\t\tSystem.out.println(5);\n\t}\n}", main: true }],
        input: "",
      })
      .expect(200);

    expect(response.body.result.executionResult.stdout).toEqual("5\n");
    expect(response.body.result.executionResult.stderr).toEqual('');
    expect(response.body.result.executionResult.exitCode).toEqual(0);

    expect(response.body.result.lang).toEqual('java');
    expect(response.body.result.isSucceed).toEqual(true);
  },
  timeout_ms
);

it.skip(
  "[@concurrent] return syntax error while compiling the code and return error message",
  async () => {
    const response = await request(app)
      .post("/api/compilers/java")
      .send({
        sources: [{ name: 'Main.java', content: "public class Main {\n\tpublic static void main(String[] args) {\n\t\tSystem.out.println(5\n\t}\n}", main: true }],
        input: "",
      })
      .expect(200);

    expect(response.body.result.executionResult.stdout).toEqual('');
    expect(response.body.result.executionResult.stderr).toContain('^');
    expect(response.body.result.executionResult.exitCode).toEqual(1);

    expect(response.body.result.lang).toEqual('java');
    expect(response.body.result.isSucceed).toEqual(false);
  },
  timeout_ms
);

it.skip(
  "[@concurrent] long output response will be limited",
  async () => {
    const response = await request(app)
      .post("/api/compilers/java")
      .send({
        sources: [{ name: 'Main.java', content: "public class Main {\n\tpublic static void main(String[] args) {\n\t\tfor (int number : new int[3000]) System.out.print(number);\n\t}\n}", main: true }],
        input: "",
      })
    //   .expect(200);

    console.log(response.body)

    expect(response.body.result.executionResult.stdout.length).toEqual(1000);
    expect(response.body.result.executionResult.stderr).toContain('');
    // expect(response.body.result.executionResult.exitCode).toEqual(null);

    expect(response.body.result.lang).toEqual('java');
    expect(response.body.result.isSucceed).toEqual(true);
  },
  timeout_ms
);
