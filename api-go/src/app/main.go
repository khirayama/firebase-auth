package main

import (
	"encoding/json"
	"log"
	"net/http"

	"github.com/gorilla/mux"
)

type resource struct {
	Message string `json:"message"`
}

func publicResourceIndexHandler(w http.ResponseWriter, r *http.Request) {
	resrc := resource{Message: "public"}
	json.NewEncoder(w).Encode(resrc)
}

func privateResourceIndexHandler(w http.ResponseWriter, r *http.Request) {
	resrc := resource{Message: "private"}
	json.NewEncoder(w).Encode(resrc)
}

func main() {
	r := mux.NewRouter()
	r.Use(CORSMiddleware)
	r.HandleFunc("/public-resources", publicResourceIndexHandler)
	r.HandleFunc("/private-resources", AuthHandler(privateResourceIndexHandler))

	http.Handle("/", r)
	log.Fatal(http.ListenAndServe(":3001", nil))
}
