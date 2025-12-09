package dev.danieliuga.Mercador;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.autoconfigure.gson.GsonAutoConfiguration;

@SpringBootApplication(exclude = {GsonAutoConfiguration.class})
public class  MercadorApplication {

	public static void main(String[] args) {
		SpringApplication.run(MercadorApplication.class, args);
	}

}
