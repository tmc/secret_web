package main

import (
	uuid "github.com/nu7hatch/gouuid"
)

func guid() string {
	u, _ := uuid.NewV4()
	return u.String()
}
