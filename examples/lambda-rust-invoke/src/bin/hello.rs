extern crate log;
extern crate simple_logger;
extern crate serde_derive;
extern crate lambda_runtime;
extern crate simple_error;

use std::error::Error;
use lambda_runtime::{error::HandlerError, lambda, Context};
use log::{error};
use serde_derive::{Deserialize, Serialize};
use simple_error::bail;

#[derive(Deserialize, Clone)]
struct CustomEvent {
	#[serde(rename = "firstName")]
	first_name: String,
}

#[derive(Serialize, Clone)]
struct CustomOutput {
	message: String,
}

fn main() -> Result<(), Box<dyn Error>> {
	simple_logger::init_with_level(log::Level::Info)?;
	lambda!(my_handler);
	Ok(())
}

fn my_handler(e: CustomEvent, c: Context) -> Result<CustomOutput, HandlerError> {
	if e.first_name == "" {
		error!("Empty first name in request {}", c.aws_request_id);
		bail!("Empty first name");
	}

	Ok(CustomOutput {
		message: format!("Hello, {}!", e.first_name),
	})
}