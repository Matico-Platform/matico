use crate::errors::ServiceError;
pub use ::config::ConfigError;
use serde::Deserialize;
use std::str;

#[derive(Deserialize, Clone, Debug)]
pub struct DbConfig {
    pub host: String,
    pub name: String,
    pub port: Option<String>,
    pub password: Option<String>,
    pub username: Option<String>,
}

#[derive(Deserialize, Clone, Debug)]
pub struct DataDbConfig {
    pub host: String,
    pub name: String,
    pub port: Option<String>,
    pub password: Option<String>,
    pub username: Option<String>,
}

#[derive(Deserialize, Debug)]
pub struct Config {
    pub db: DbConfig,
    pub datadb: DataDbConfig,
    pub server_addr: String,
    pub testdb: Option<DbConfig>,
    pub testdatadb: Option<DataDbConfig>,
    pub test_env: Option<bool>,
}

impl Config {
    pub fn from_conf() -> Result<Self, ConfigError> {
        let mut cfg = ::config::Config::new();
        cfg.merge(config::Environment::new()).unwrap();
        cfg.try_into()
    }

    pub fn connection_string(&self) -> Result<String, ServiceError> {
        let config = if Some(true) == self.test_env {
            println!("USING TEST CONFIG");
            self.testdb.clone().ok_or_else(|| ServiceError::InternalServerError(
                "Failed to find test db settings".into(),
            ))
        } else {
            Ok(self.db.clone())
        }?;

        let username_password = match (&config.username, &config.password) {
            (Some(username), Some(password)) => Ok(format!("{}:{}@", username, password)),
            (None, None) => Ok(format!("")),
            (Some(username), None) => Ok(format!("{}@", username)),
            (None, Some(_)) => Err(ServiceError::DBConfigError(
                "DB config needs a username if your specifying a password".into(),
            )),
        }?;

        let port = match &config.port {
            Some(port) => format!(":{}", port),
            None => format!(""),
        };

        Ok(format!(
            "postgresql://{user_pass}{host}{port}/{name}",
            user_pass = username_password,
            host = config.host,
            port = port,
            name = config.name
        ))
    }

    pub fn data_connection_string(&self) -> Result<String, ServiceError> {
        let config = if Some(true) == self.test_env {
            self.testdatadb
                .clone()
                .ok_or_else(|| ServiceError::InternalServerError(
                    "Failed to find test db settings".into(),
                ))
        } else {
            Ok(self.datadb.clone())
        }?;

        let username_password = match (&config.username, &config.password) {
            (Some(username), Some(password)) => Ok(format!("{}:{}@", username, password)),
            (None, None) => Ok(format!("")),
            (Some(username), None) => Ok(format!("{}@", username)),
            (None, Some(_)) => Err(ServiceError::DBConfigError(
                "DB config needs a username if your specifying a password".into(),
            )),
        }?;

        let port = match &config.port {
            Some(port) => format!(":{}", port),
            None => format!(""),
        };

        Ok(format!(
            "postgresql://{user_pass}{host}{port}/{name}",
            user_pass = username_password,
            host = config.host,
            port = port,
            name = config.name
        ))
    }

    pub fn org_connection_string(&self) -> Result<String, ServiceError> {
        let config = if Some(true) == self.test_env {
            self.testdatadb
                .clone()
                .ok_or_else(|| ServiceError::InternalServerError(
                    "Failed to find test db settings".into(),
                ))
        } else {
            Ok(self.datadb.clone())
        }?;

        let db = format!("dbname={}", config.name);

        let user = match &config.username {
            Some(user) => format!("user={}", user),
            None => format!(""),
        };

        let port = if let Some(port) = &config.port {
            format!("port = {}", port)
        } else {
            "".to_string()
        };

        let host = format!("host = {}", config.host);

        let password = if let Some(pass) = &config.password {
            format!("password={}", pass)
        } else {
            format!("")
        };

        Ok(format!(
            "PG:{db} {user} {host} {port} {password}",
            db = db,
            user = user,
            host = host,
            port = port,
            password = password
        ))
    }
}
