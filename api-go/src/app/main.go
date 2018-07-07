package main

import (
	"encoding/json"
	"github.com/gorilla/mux"
	"log"
	"net/http"
)

type Resource struct {
	Message string `json:"message"`
}

func PublicResourceIndexHandler(w http.ResponseWriter, r *http.Request) {
	resource := Resource{Message: "public"}

	json.NewEncoder(w).Encode(resource)
}

func PrivateResourceIndexHandler(w http.ResponseWriter, r *http.Request) {
	resource := Resource{Message: "private"}

	json.NewEncoder(w).Encode(resource)
}

func main() {
	r := mux.NewRouter()
	r.HandleFunc("/public-resources", PublicResourceIndexHandler)
	r.HandleFunc("/private-resources", PrivateResourceIndexHandler)

	http.Handle("/", r)
	log.Fatal(http.ListenAndServe(":8080", nil))
}
