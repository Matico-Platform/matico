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

    pub data_db_host: String,
    pub data_db_name: String,
    pub data_db_port: Option<u16>,
    pub data_db_username: String,
    pub data_db_password: Option<String>,
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

    pub fn data_db_config(&self) -> tokio_postgres::Config {
        let mut pg_config = tokio_postgres::Config::new();
        pg_config.host(&self.data_db_host);
        pg_config.dbname(&self.data_db_name);
        pg_config.user(&self.data_db_username);

        if let Some(password) = &self.data_db_password {
            pg_config.password(&password);
        }

        if let Some(port) = self.data_db_port {
            pg_config.port(port);
        }
        pg_config
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
