package dev.danieliuga.Mercador.model;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;
import org.bson.types.ObjectId;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.util.List;
import java.util.Objects;

@Document(collection = "conversations")
@Data
@AllArgsConstructor
@NoArgsConstructor
public class Conversation {
    @Id
    private ObjectId id;

    private ObjectId user1;
    private ObjectId user2;

    private List<Message> messages;

    public Boolean hasThisMessage(ObjectId idMessage){
        for (Message mess : messages){
            if (mess.getId().compareTo(idMessage) == 0)
                return true;
        }
        return false;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (!(o instanceof Conversation that)) return false;

        // verificăm egalitatea indiferent de ordinea userilor
        return (Objects.equals(user1, that.user1) && Objects.equals(user2, that.user2)) ||
                (Objects.equals(user1, that.user2) && Objects.equals(user2, that.user1));
    }

    @Override
    public int hashCode() {
        // facem hash-ul independent de ordine, convertind în string
        String u1 = user1 != null ? user1.toHexString() : "";
        String u2 = user2 != null ? user2.toHexString() : "";

        // sortăm după string ca să fie determinist
        return Objects.hash(
                u1.compareTo(u2) < 0 ? u1 + u2 : u2 + u1
        );
    }
}
