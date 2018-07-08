package main

import (
	"encoding/json"
	"log"
	"net/http"

	"github.com/gorilla/mux"
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
	r.Use(CORSMiddleware)
	r.HandleFunc("/public-resources", PublicResourceIndexHandler)
	r.HandleFunc("/private-resources", AuthHandler(PrivateResourceIndexHandler))

	http.Handle("/", r)
	log.Fatal(http.ListenAndServe(":3001", nil))
}
