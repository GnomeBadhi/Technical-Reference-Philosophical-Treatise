cmake_minimum_required(VERSION 3.15)
project(WifiKernelAdapter LANGUAGES CXX)

# Set C++ standard
set(CMAKE_CXX_STANDARD 17)
set(CMAKE_CXX_STANDARD_REQUIRED ON)

# Source files
set(SOURCES
    KernelWifiAdapter.cpp
    WifiRelayStub.cpp
)

set(HEADERS
    IEventSignalEncoder.h
    IWifiRelay.h
    KernelWifiAdapter.h
    WifiRelayStub.h
)

# Create a static library
add_library(wifikernel STATIC ${SOURCES} ${HEADERS})

# Include directory for consumers
target_include_directories(wifikernel PUBLIC ${CMAKE_CURRENT_SOURCE_DIR})

# Example executable (optional, safe)
add_executable(example main.cpp)
target_link_libraries(example PRIVATE wifikernel)
