package main

import (
	"encoding/json"
	"fmt"
	jwt "github.com/dgrijalva/jwt-go"
	"github.com/gorilla/mux"
	"log"
	"net/http"
	"strings"
)

type Resource struct {
	Message string `json:"message"`
}

func CorsMiddleware(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		w.Header().Set("Access-Control-Allow-Origin", "http://localhost:3000")
		w.Header().Set("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization")
		w.Header().Set("Access-Control-Allow-Methods", "PUT, DELETE")
		w.Header().Set("Access-Control-Allow-Credentials", "true")
		next.ServeHTTP(w, r)
	})
}

type jwtHeader struct {
	Algorithm string `json:"alg"`
	Type      string `json:"typ"`
	KeyID     string `json:"kid,omitempty"`
}

func AuthHandler(next http.HandlerFunc) http.HandlerFunc {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		authorization := r.Header.Get("Authorization")
		jwtToken := strings.Replace(authorization, "Bearer ", "", 1)
		// fmt.Print(authorization)
		// fmt.Print(jwtToken)
		token, _ := jwt.Parse(jwtToken, func(token *jwt.Token) (interface{}, error) {
			// fmt.Print(token)
			return []byte("foobar"), nil
		})
		fmt.Print(token)
		next(w, r)
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
