#include <iostream>
#include "KernelWifiAdapter.h"
#include "WifiRelayStub.h"

// A simple example encoder that just wraps the event payload.
// Real encoders should be implemented privately.
class ExampleEncoder : public IEventSignalEncoder {
public:
    EncodedSignal encode(const Event& evt) override {
        EncodedSignal sig;
        sig.encoded = "ENCODED:" + evt.payload;  // harmless placeholder
        sig.tag = evt.type;
        return sig;
    }
};

int main() {
    // Create encoder + stub relay
    ExampleEncoder encoder;
    WifiRelayStub relay("127.0.0.1", 9000);

    // Create adapter
    KernelWifiAdapter adapter(encoder, relay);

    // Example event
    Event evt;
    evt.id        = "evt-001";
    evt.type      = "example";
    evt.channel   = "default";
    evt.payload   = "hello-world";
    evt.timestamp = 0;

    // Process event through the adapter
    adapter.process(evt);

    return 0;
}
