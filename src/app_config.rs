pub use ::config::ConfigError;
use serde::Deserialize;

#[derive(Deserialize)]
pub struct Config{
    pub server_addr: String,
    pub db_string: String 
}

impl Config{
    pub fn from_conf() -> Result<Self,ConfigError>{
        let mut cfg  = ::config::Config::new();
        cfg.merge(config::File::with_name("Settings")).unwrap();
        cfg.try_into()
    }
}