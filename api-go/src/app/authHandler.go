package main

import (
	"crypto/rsa"
	"crypto/x509"
	"encoding/json"
	"encoding/pem"
	"net/http"
	"strings"

	jwt "github.com/dgrijalva/jwt-go"
)

const (
	publicKeySrcURL = "https://www.googleapis.com/robot/v1/metadata/x509/securetoken@system.gserviceaccount.com"
)

type JwtHeader struct {
	Alg string `json:"alg"`
	Kid string `json:"kid"`
}

func decodeJwtHeader(jwtToken string) JwtHeader {
	segments := strings.Split(jwtToken, ".")
	decodedHeader, _ := jwt.DecodeSegment(segments[0])
	var jwtHeader JwtHeader
	json.Unmarshal(decodedHeader, &jwtHeader)

	return jwtHeader
}

func getPublicKeys() (publicKeys map[string]string, err error) {
	resp, err := http.Get(publicKeySrcURL)
	if err != nil {
		return nil, err
	}
	defer resp.Body.Close()
	decoder := json.NewDecoder(resp.Body)
	publicKeys = make(map[string]string)
	decoder.Decode(&publicKeys)

	return publicKeys, nil
}

var publicKeys, _ = getPublicKeys()

func AuthHandler(next http.HandlerFunc) http.HandlerFunc {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		authorization := r.Header.Get("Authorization")
		jwtToken := strings.Replace(authorization, "Bearer ", "", 1)

		jwtHeader := decodeJwtHeader(jwtToken)

		publicKey, ok := publicKeys[jwtHeader.Kid]
		if !ok {
			next(w, r)
			return
		}
		block, _ := pem.Decode([]byte(publicKey))
		cert, _ := x509.ParseCertificate(block.Bytes)
		pk := cert.PublicKey.(*rsa.PublicKey)

		token, _ := jwt.Parse(jwtToken, func(token *jwt.Token) (interface{}, error) {
			return pk, nil
		})

		if !token.Valid {
			http.Error(w, "Not authorized", 401)
			return
		} else {
			next(w, r)
		}
	})
}
