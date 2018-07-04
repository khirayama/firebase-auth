#![feature(plugin)]
#![plugin(rocket_codegen)]

extern crate rocket;

use rocket::response::content;

#[get("/")]
fn index() -> content::Json<&'static str> {
    content::Json("{ 'message': 'rust' }")
}

fn main() {
    rocket::ignite().mount("/", routes![index]).launch();
}
