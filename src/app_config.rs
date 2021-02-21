use crate::errors::ServiceError;
pub use ::config::ConfigError;
use serde::Deserialize;
use std::str;

#[derive(Deserialize)]
pub struct DbConfig{
    pub host: String,
    pub name: String,
    pub port: Option<String>,
    pub password: Option<String>,
    pub username: Option<String>,
}

#[derive(Deserialize)]
pub struct Config {
    pub db: DbConfig, 
    pub datadb: deadpool_postgres::Config,
    pub server_addr: String,
    pub cert_path: Option<String>
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


    pub fn org_connection_string(&self) -> Result<String, ServiceError> {
        let pg_config = self.datadb.get_pg_config().unwrap();

        let db = format!("dbname={}", pg_config.get_dbname().unwrap());

        let user = match &pg_config.get_user(){
            Some(user) => format!("user={}", user),
            None => format!(""),
        };

        let port = format!("port = {}", pg_config.get_ports()[0]);

        let host = if let tokio_postgres::config::Host::Tcp(host) = &pg_config.get_hosts()[0]{
            format!("host= {}",host)
        }else{
            String::from("")
        };
        
        let password = match &pg_config.get_password() {
            Some(password) => format!("password={}", str::from_utf8(password).unwrap()),
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
