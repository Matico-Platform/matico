use crate::errors::ServiceError;
pub use ::config::ConfigError;
use serde::Deserialize;
use std::str;

#[derive(Deserialize)]
pub struct DbConfig {
    pub host: String,
    pub name: String,
    pub port: Option<String>,
    pub password: Option<String>,
    pub username: Option<String>,
}

#[derive(Deserialize)]
pub struct DataDBConfig {
    pub host: String,
    pub name: String,
    pub port: Option<String>,
    pub password: Option<String>,
    pub username: Option<String>,
}

#[derive(Deserialize)]
pub struct Config {
    pub db: DbConfig,
    pub datadb: DataDBConfig,
    pub server_addr: String,
}

impl Config {
    pub fn from_conf() -> Result<Self, ConfigError> {
        let mut cfg = ::config::Config::new();
        cfg.merge(config::Environment::new()).unwrap();
        cfg.try_into()
    }

    pub fn connection_string(&self) -> Result<String, ServiceError> {
        let username_password = match (&self.db.username, &self.db.password) {
            (Some(username), Some(password)) => Ok(format!("{}:{}@", username, password)),
            (None, None) => Ok(format!("")),
            (Some(username), None) => Ok(format!("{}@", username)),
            (None, Some(_)) => Err(ServiceError::DBConfigError(
                "DB config needs a username if your specifying a password".into(),
            )),
        }?;

        let port = match &self.db.port {
            Some(port) => format!(":{}", port),
            None => format!(""),
        };

        Ok(format!(
            "postgresql://{user_pass}{host}{port}/{name}",
            user_pass = username_password,
            host = self.db.host,
            port = port,
            name = self.db.name
        ))
    }

    pub fn data_connection_string(&self) -> Result<String, ServiceError> {
        let username_password = match (&self.datadb.username, &self.datadb.password) {
            (Some(username), Some(password)) => Ok(format!("{}:{}@", username, password)),
            (None, None) => Ok(format!("")),
            (Some(username), None) => Ok(format!("{}@", username)),
            (None, Some(_)) => Err(ServiceError::DBConfigError(
                "DB config needs a username if your specifying a password".into(),
            )),
        }?;

        let port = match &self.db.port {
            Some(port) => format!(":{}", port),
            None => format!(""),
        };

        Ok(format!(
            "postgresql://{user_pass}{host}{port}/{name}",
            user_pass = username_password,
            host = self.db.host,
            port = port,
            name = self.db.name
        ))
    }

    pub fn org_connection_string(&self) -> Result<String, ServiceError> {
        let db = format!("dbname={}", self.datadb.name);

        let user = match &self.datadb.username {
            Some(user) => format!("user={}", user),
            None => format!(""),
        };

        let port = if let Some(port) = &self.datadb.port {
            format!("port = {}", port)
        } else {
            "".to_string()
        };

        let host = format!("host = {}", self.datadb.host);

        let password = if let Some(pass) = &self.datadb.password {
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
