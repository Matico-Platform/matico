use crate::errors::ServiceError;
pub use ::config::ConfigError;
use serde::Deserialize;

#[derive(Deserialize)]
pub struct Config {
    pub db_host: String,
    pub db_name: String,
    pub db_port: Option<String>,
    pub db_password: Option<String>,
    pub db_username: Option<String>,
    pub server_addr: String,
}

impl Config {
    pub fn from_conf() -> Result<Self, ConfigError> {
        let mut cfg = ::config::Config::new();
        cfg.merge(config::Environment::with_prefix("SMS")).unwrap();
        cfg.try_into()
    }

    pub fn connection_string(&self) -> Result<String, ServiceError> {
        let username_password = match (&self.db_username, &self.db_password) {
            (Some(username), Some(password)) => Ok(format!("{}:{}@", username, password)),
            (None, None) => Ok(format!("")),
            (Some(username), None) => Ok(format!("{}@", username)),
            (None, Some(_)) => Err(ServiceError::DBConfigError(
                "DB config needs a username if your specifying a password".into(),
            )),
        }?;

        let port = match &self.db_port {
            Some(port) => format!(":{}", port),
            None => format!(""),
        };

        Ok(format!(
            "postgresql://{user_pass}{host}{port}/{name}",
            user_pass = username_password,
            host = self.db_host,
            port = port,
            name = self.db_name
        ))
    }

    pub fn org_connection_string(&self) -> Result<String, ServiceError> {
        let db = format!("dbname={}", self.db_name);
        let user = match &self.db_username {
            Some(user) => format!("user={}", user),
            None => format!(""),
        };
        let port = match &self.db_port {
            Some(port) => format!("port={}", port),
            None => format!(""),
        };
        let host = format!("host={}", self.db_host);
        let password = match &self.db_password {
            Some(password) => format!("password={}", password),
            None => format!(""),
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
