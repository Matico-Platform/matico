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
    pub max_connections: Option<u32>
}

#[derive(Deserialize, Debug)]
pub struct Config {
    pub db: DbConfig,
    pub datadb: DbConfig,
    pub server_addr: String,
}

impl Config {
    pub fn from_conf() -> Result<Self, ConfigError> {
        let mut cfg = ::config::Config::new();
        cfg.merge(config::Environment::new()).unwrap();
        cfg.try_into()
    }

    pub fn connection_string(&self) -> Result<String, ServiceError> {
        let config = self.db.clone();
        let base_connection_string = self.connection_string_without_db()?;
        Ok(format!("{}/{}", base_connection_string, config.name))
    }

    pub fn connection_string_without_db(&self) -> Result<String, ServiceError> {
        let config = self.db.clone();

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
            "postgresql://{user_pass}{host}{port}",
            user_pass = username_password,
            host = config.host,
            port = port,
        ))
    }

    pub fn data_connection_string(&self) -> Result<String, ServiceError> {
        let partial_connection_string = self.data_connection_string_without_db()?;
        let name = self.datadb.name.clone();
        Ok(format!("{}/{}", partial_connection_string, name))
    }

    pub fn data_connection_string_without_db(&self) -> Result<String, ServiceError> {
        let config = self.datadb.clone();

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
            "postgresql://{user_pass}{host}{port}",
            user_pass = username_password,
            host = config.host,
            port = port,
        ))
    }

    pub fn org_connection_string(&self) -> Result<String, ServiceError> {
        let config = self.datadb.clone();

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

        let connection_string = format!(
            "PG:{db} {user} {host} {port} {password}",
            db = db,
            user = user,
            host = host,
            port = port,
            password = password
        );

        Ok(connection_string)
    }
}
