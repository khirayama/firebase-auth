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

// MiddleWare
func CorsMiddleware(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		w.Header().Set("Access-Control-Allow-Origin", "http://localhost:3000")
		w.Header().Set("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization")
		w.Header().Set("Access-Control-Allow-Methods", "PUT, DELETE")
		w.Header().Set("Access-Control-Allow-Credentials", "true")
		next.ServeHTTP(w, r)
	})
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
	r.Use(CorsMiddleware)
	r.HandleFunc("/public-resources", PublicResourceIndexHandler)
	r.HandleFunc("/private-resources", AuthHandler(PrivateResourceIndexHandler))

	http.Handle("/", r)
	log.Fatal(http.ListenAndServe(":3001", nil))
}
