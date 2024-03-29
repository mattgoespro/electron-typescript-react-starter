import config from "./desktop-window.config.json";

type Configuration = typeof config;

type CamelToSnakeCase<S extends string> = S extends `${infer Start}${infer Rest}`
  ? `${Start extends Uppercase<Start> ? "_" : ""}${Lowercase<Start>}${CamelToSnakeCase<Rest>}`
  : "";

type CapitalizeFirstLetter<S extends string> = S extends `${infer First}${infer Rest}`
  ? `${Uppercase<First>}${Rest}`
  : "";

type KeysToUpperCase<T> = keyof {
  [K in keyof T as Uppercase<CapitalizeFirstLetter<CamelToSnakeCase<string & K>>>]: K;
};

function replaceEnvironmentVariables(value: string) {
  if (value == null) {
    return value;
  }

  return value.replace(/\$[A-Z]+/g, (_, key) => process.env[key] ?? "");
}

export function getConfiguration<T extends keyof Configuration>(configKey: T): Configuration[T] {
  let configValue = config[replaceEnvironmentVariables(configKey)];

  if (configValue == null) {
    configValue = getEnvironment(
      convertToUppercaseSnakeCase(configKey) as KeysToUpperCase<typeof config>
    );
  }

  if (configValue == null) {
    throw new Error(`Could not find configuration value for ${configKey}`);
  }

  return configValue;
}

function getEnvironment(variable: KeysToUpperCase<typeof config>) {
  return process.env[variable];
}

function convertToUppercaseSnakeCase(value: string) {
  return value.replace(/[A-Z]/g, (match) => `_${match}`).toUpperCase();
}
